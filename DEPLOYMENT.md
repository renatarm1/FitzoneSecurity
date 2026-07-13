# Desplegar FitZone en Hostinger

## Arquitectura

Django sirve **todo** desde un solo proceso: la API (`/api/...`), el admin (ruta configurada
en `ADMIN_URL`), y el build de React (`fitzone-frontend/dist/`) como archivo estático, vía
[WhiteNoise](https://whitenoise.readthedocs.io/). No hace falta un servidor Node en producción
ni configurar CORS entre dominios distintos: todo vive bajo el mismo dominio.

Base de datos: SQLite (`db.sqlite3`), suficiente para el tráfico esperado de este proyecto.

## 1. Pasos comunes (ambos tipos de hosting)

1. **Construir el frontend** (requiere Node local o en el servidor):
   ```bash
   cd fitzone-frontend
   npm install
   npm run build
   ```
   Esto genera `fitzone-frontend/dist/`, que Django ya sabe servir.

2. **Crear el `.env`** en la raíz del proyecto a partir de `.env.example`, con valores reales:
   - `SECRET_KEY`: generar uno nuevo con `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`
   - `ADMIN_URL`: una ruta impredecible, no `admin/`
   - `ALLOWED_HOSTS`: tu(s) dominio(s) real(es)
   - `DJANGO_DEBUG=False`
   - `SECURE_SSL_REDIRECT=True` (una vez tengas SSL activo)
   - `RECAPTCHA_SECRET_KEY`: **la clave que estaba en este repo quedó expuesta en el historial
     de git durante el desarrollo — genera una nueva en la consola de Google reCAPTCHA antes de
     ir a producción.**

3. **Instalar dependencias, migrar y recolectar estáticos:**
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
   `migrate` también carga el catálogo semilla (24 productos) vía la migración de datos
   `catalogo/migrations/0002_seed_productos.py`.

4. **Crear un superusuario** para entrar al admin:
   ```bash
   python manage.py createsuperuser
   ```

## 2. Opción A — Hosting compartido (hPanel "Setup Python App")

Hostinger usa Phusion Passenger para correr apps Python en planes compartidos/Business.

1. En hPanel, crea la app Python apuntando a la raíz del proyecto.
2. El archivo de arranque es **`passenger_wsgi.py`** (ya incluido en la raíz) — Passenger lo
   detecta automáticamente, no hay que tocarlo.
3. Sube el proyecto completo (incluyendo `fitzone-frontend/dist/` ya construido, porque en
   hosting compartido normalmente no puedes correr `npm run build` ahí mismo — constrúyelo en
   tu máquina y sube la carpeta `dist/`).
4. Corre los pasos de la sección 1 desde la terminal SSH que da hPanel para esa app.
5. Reinicia la app Python desde hPanel después de cualquier cambio.

**Limitaciones de este modo:** un solo proceso, sin tareas en segundo plano ni cron propios más
allá de lo que ofrezca hPanel — no afecta a este proyecto porque no usa workers async.

## 3. Opción B — VPS / Cloud Hosting

Acceso root completo: Gunicorn detrás de Nginx.

1. Sube el proyecto a algo como `/var/www/fitzone` y crea un virtualenv ahí:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Copia `deploy/gunicorn.service` a `/etc/systemd/system/fitzone.service`, ajusta rutas/usuario,
   y actívalo:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now fitzone
   ```
3. Copia `deploy/nginx.conf.example` a `/etc/nginx/sites-available/fitzone`, ajusta el dominio,
   habilítalo y recarga Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/fitzone /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Activa SSL (Hostinger ofrece Let's Encrypt gratis desde hPanel, o `certbot --nginx` si
   administras el VPS directo).

## 4. Verificación post-deploy

- `https://tudominio.com/` → debe cargar la tienda (React).
- `https://tudominio.com/api/catalogo/productos/` → debe devolver el JSON del catálogo.
- `https://tudominio.com/<ADMIN_URL>` → debe mostrar el login del admin de Django.
- Revisa `logs/security.log` y `logs/application.log` después de probar login/registro/checkout.

## 5. Recordatorios de seguridad

- Nunca subas `.env` ni `db.sqlite3` a git (ya están en `.gitignore`).
- Rota `RECAPTCHA_SECRET_KEY` (ver punto 1) antes de ir a producción real.
- Haz backups periódicos de `db.sqlite3` — es un archivo único, no una base administrada.
