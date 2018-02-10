import psycopg2
from shapely.geometry import LineString, Polygon, shape
from shapely.ops import transform
from shapely import wkb
import pyproj
from functools import partial
from shapely.geometry import Polygon, mapping
from area import area

conn = psycopg2.connect(port=5432, password="password", host="192.168.99.100", user="postgres")

curs = conn.cursor()


def create_geojson(polygon):
    coordinates = [[]]

    for point in polygon:
        coordinates[0].append([point[0], point[1]])
    obj = {'type':'Polygon','coordinates':coordinates}
    return obj

def read_fences():
    fences = []
    areas = []
    with open("fences.txt") as fp:
        line = fp.readline()
        while line:
            x = line.replace("(", "")
            x = x.replace(")", "")
            cords = x.split(",")
            latlon = []
            for i in range(0, len(cords), 2):
                latlon.append((float(cords[i]), float(cords[i + 1])))
            areas.append(area(create_geojson(mapping(Polygon(latlon))["coordinates"][0])) / 1000000)
            fences.append(Polygon(latlon))
            line = fp.readline()
    return fences, areas

fences, areas = read_fences()
curs.execute('CREATE TEMP TABLE my_polygons(geom geometry, name text)')
for i in range(0, len(fences)):
    # Send it to PostGIS

    curs.execute(
        'INSERT INTO my_polygons(geom, name)'
        'VALUES (ST_SetSRID(%(geom)s::geometry, %(srid)s), %(name)s)',
        {'geom': fences[i].wkb_hex, 'srid': 4326, 'name': str(i)})

    conn.commit()  # save data

# Fetch the data from PostGIS, reading hex-encoded WKB into a Shapely geometry
curs.execute('SELECT name, geom FROM my_polygons')
for name, geom_wkb in curs:
    geom = wkb.loads(geom_wkb, hex=True)
    #print('{0}: {1}'.format(name, geom.wkt))
    s = shape(geom)
    proj = partial(pyproj.transform, pyproj.Proj(init='epsg:4326'),
                   pyproj.Proj(init='epsg:3857'))

    print(transform(proj, s).area / 1000000)
    print(areas[int(name)])
    # First Line: LINESTRING Z (2.2 4.4 10.2, 3.3 5.5 8.4)
