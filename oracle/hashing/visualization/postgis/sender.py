import psycopg2
from shapely.geometry import LineString, Polygon
from shapely import wkb

conn = psycopg2.connect( port=5432, password="password", host="192.168.99.100", user="postgres")

curs = conn.cursor()

# Make a Shapely geometry
ls = LineString([(2.2, 4.4, 10.2), (3.3, 5.5, 8.4)])

polygon = Polygon([(-90, 180),(90, 180),(90, -180),(-90, -180)])

# Send it to PostGIS
curs.execute('CREATE TEMP TABLE my_polygons(geom geometry, name text)')
curs.execute(
    'INSERT INTO my_polygons(geom, name)'
    'VALUES (ST_SetSRID(%(geom)s::geometry, %(srid)s), %(name)s)',
    {'geom': polygon.wkb_hex, 'srid': 4326, 'name': 'First Polygon'})

conn.commit()  # save data

# Fetch the data from PostGIS, reading hex-encoded WKB into a Shapely geometry
curs.execute('SELECT name, geom FROM my_polygons')
for name, geom_wkb in curs:
    geom = wkb.loads(geom_wkb, hex=True)
    print('{0}: {1}'.format(name, geom.wkt))
    print(geom.area)
# First Line: LINESTRING Z (2.2 4.4 10.2, 3.3 5.5 8.4)