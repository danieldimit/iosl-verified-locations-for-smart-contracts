from s2sphere import *
import math
import random

def getNewPointFromDistanceBearing(a, distance, bearing):

    lat = a[0]
    lon = a[1]
    dist = distance / 6371
    brng = deg2rad(bearing)

    lat1 = deg2rad(lat)
    lon1 = deg2rad(lon)

    lat2 = math.asin(math.sin(lat1) * math.cos(dist) +
        math.cos(lat1) * math.sin(dist) * math.cos(brng))

    lon2 = lon1 + math.atan2(math.sin(brng) * math.sin(dist) *
        math.cos(lat1),
        math.cos(dist) - math.sin(lat1) *
        math.sin(lat2))

    return [rad2deg(lon2), rad2deg(lat2)]


def deg2rad(deg):
    return deg * (math.pi/180)


def rad2deg(rad):
    return rad * 180 / math.pi



def generateRandomGeofence():

    maxBearing = 45

    center = [52.520007, 13.404954]

    geofence = []
    bearing = 0

    while(bearing < 360 - maxBearing):
        newBearing = math.floor(random.random() * maxBearing) + bearing
        while(newBearing > 360):
            newBearing = math.floor(random.random() * maxBearing) + bearing
        
        distance = math.floor(random.random() * 30) + 20
        geofence.append(getNewPointFromDistanceBearing(center, distance, newBearing))
        bearing = newBearing
    
    return geofence

def hashPolygon():

    #loop = S2Loop([S2CellId.FromLatLng(S2LatLng.FromDegrees(-51.264871, -30.241701)).id()])

    region = LatLngRect(
        LatLng.from_degrees(-51.264871, -30.241701),
        LatLng.from_degrees(-51.04618, -30.000003))

    coverer = RegionCoverer()
    coverer.min_level = 8
    coverer.max_level = 15
    covering = coverer.get_covering(region)

    print(len(covering))

print(hashPolygon())
print(generateRandomGeofence())