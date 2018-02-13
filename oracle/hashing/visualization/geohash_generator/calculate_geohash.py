from polygon_geohasher.polygon_geohasher import polygon_to_geohashes, geohashes_to_polygon
from shapely import geometry
from shapely.geometry import Polygon, mapping
from area import area
import itertools
import geohash

import sys

def compress(hashes):
    len_hash = len(hashes[0])
    new_prefix = True
    prefix = ""
    for i in range(0, len_hash):
        for j in range(0, len(hashes)-1):

            if hashes[j][i] != hashes[j+1][i]:
                new_prefix = False
        if new_prefix:
            prefix = hashes[0][:i+1]
    for i in range(1, len_hash - len(prefix)):
        base32chars = 'bcdefgjhkmnpqrstuvwxyz0123456789'
        l = [prefix + ''.join(x) for x in itertools.product(base32chars, repeat=i)]
        for p in l:
            count = len([x for x in hashes if p in x])
            if count == (32 ** (len_hash - len(p))):
                hashes = [x for x in hashes if not p in x]
                hashes.append(p)

    return hashes


def create_geojson(polygon):
    coordinates = [[]]

    for point in polygon:
        coordinates[0].append([point[0], point[1]])
    obj = {'type':'Polygon','coordinates':coordinates}
    return obj

def read_fences():
    fences = []
    with open("fences.txt") as fp:
        line = fp.readline()
        while line:
            x = line.replace("(", "")
            x = x.replace(")", "")
            cords = x.split(",")
            latlon = []
            for i in range(0, len(cords), 2):
                latlon.append((float(cords[i]), float(cords[i + 1])))
            fences.append(latlon)
            line = fp.readline()
    return fences


if __name__ == "__main__":
    args = sys.argv
    if len(args) < 4:
        print("Usage: <path to fences file> <min precision> <max precision> <optional: save points of points --points>")
        exit(1)

    points = False

    fences_path = args[1]
    precision_min = args[2]
    precision_max = args[3]

    if len(args) >= 5:
        if args[4] == "--points":
            points = True

    fences = read_fences()

    for precision in range(int(precision_min), int(precision_max)+1):
        geohash_num = []
        p_area = []
        for fence in fences:
            polygon = geometry.Polygon(fence)
            real_area = area(create_geojson(mapping(polygon)["coordinates"][0])) / 1000000

            geohashes_polygon = polygon_to_geohashes(polygon, precision, False)
            polygon = geohashes_to_polygon(geohashes_polygon)

            perc_area = 100 * (area(create_geojson(mapping(polygon)["coordinates"][0])) / 1000000) / real_area
            p_area.append(perc_area)
            geohash_num.append(len(compress(list(geohashes_polygon))))

            if points:
                ps = []
                for hash in compress(list(geohashes_polygon)):
                    bbox = geohash.bbox(hash)
                    lat1 = bbox['s']
                    lat2 = bbox['n']
                    lon1 = bbox['w']
                    lon2 = bbox['e']
                    ps.append(lat1)
                    ps.append(lon1)
                    ps.append(lat2)
                    ps.append(lon1)
                    ps.append(lat2)
                    ps.append(lon2)
                    ps.append(lat1)
                    ps.append(lon2)
                f = open("fences_points.txt", "a")
                f.write(str(ps))
                f.close()

        f = open("geohash_info.txt", "a")
        f.write(str(str(sum(geohash_num) / len(geohash_num)) + "\n") + "," + str(sum(p_area) / len(p_area)) )
        f.close()


