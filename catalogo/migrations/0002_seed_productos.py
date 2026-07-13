from django.db import migrations


PRODUCTOS = [
    (101, "FORUM LOW CLASSIC", 120, "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500"),
    (102, "ULTRABOOST LIGHT", 190, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500"),
    (103, "SAMBA ALTERNATIVE ROAD", 110, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500"),
    (104, "NMD_R1 V3 DESIGN", 160, "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500"),
    (105, "STAN SMITH ENDLESS", 100, "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500"),
    (106, "GAZELLE VINTAGE CORE", 120, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500"),
    (107, "SUPERSTAR BOLD BLACK", 110, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500"),
    (108, "TERREX TWO ULTRA", 180, "https://i0.wp.com/carrerasdemontana.com/wp-content/uploads/2020/04/adidas-terrex-two-ultra-parley-review-17.jpg??q=80&w=500"),
    (109, "RETROPY E5 URBAN", 130, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500"),
    (110, "4DFWD RUNNING VISION", 220, "https://d2n4wb9orp1vta.cloudfront.net/cms/brand/am/2022-am/0922-am-carbon-adidas-4dfwd-2.jpg;maxWidth=385?q=80&w=500"),
    (111, "CAMPUS 00S REMIX", 115, "https://img01.ztat.net/article/spp-media-p1/aa1de79b763a4f6c8761ef9af27551c7/49ff27a5d7b24974be22f1160c5b7f2b.jpg?q=80&w=500"),
    (112, "OZWEEGO FUTURISTIC", 140, "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=500"),
    (113, "ZX 2K BOOST TECH", 150, "https://www.endondecorrer.com/wp-content/uploads/2020/08/566337.jpg?q=80&w=500"),
    (114, "RESPONSE CL TRAIL", 140, "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500"),
    (115, "FORUM MID PREMIUM", 135, "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=500"),
    (116, "SOLARGLIDE 6 SHIFT", 160, "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=500"),
    (117, "PUREBOOST 23 STEALTH", 145, "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=500"),
    (118, "STREETBALL SE ORANGE", 125, "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=500"),
    (119, "EQUIPMENT RACING EVO", 130, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=500"),
    (120, "HARDEN STEPBACK BASKET", 105, "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=500"),
    (121, "ADIZERO ADIOS PRO", 250, "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=500"),
    (122, "YEEZY SLIDE RESIN V", 90, "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500"),
    (123, "CRAZY BYW DUNK BLDR", 170, "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500"),
    (124, "TOP TEN HI HERITAGE", 100, "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=500"),
]


def seed_productos(apps, schema_editor):
    Producto = apps.get_model('catalogo', 'Producto')
    for pk, nombre, precio, imagen_url in PRODUCTOS:
        Producto.objects.update_or_create(
            id=pk,
            defaults={
                'nombre': nombre,
                'descripcion': '',
                'precio': precio,
                'stock': 25,
                'imagen_url': imagen_url,
                'activo': True,
            }
        )


def eliminar_productos(apps, schema_editor):
    Producto = apps.get_model('catalogo', 'Producto')
    Producto.objects.filter(id__in=[p[0] for p in PRODUCTOS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('catalogo', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_productos, eliminar_productos),
    ]
