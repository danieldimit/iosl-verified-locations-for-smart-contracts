import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt
import matplotlib.pyplot as plt
import cartopy

from shapely .geometry import Polygon

def read_fences():


    f = open("fences.txt", "r")

    fences = list()
    for i in range(0, 100):
        x = f.readline()
        cords = x.split(",")
        latlon = list()
        for i in range(0, len(cords), 2):
            latlon.append([float(cords[i]), float(cords[i+1])])
        fences.append(latlon)
    return fences

def read_fences_point(path):

    f = open(path, "r")

    fences = list()
    for i in range(0, 100):
        x = f.readline()
        x = x.replace("(","")
        x = x.replace(")","")
        cords = x.split(",")
        cells = list()
        for i in range(0, len(cords) - 1, 8):
            cell = []
            lat = cords[i]
            lon = cords[i + 1]
            cell.append([float(lon), float(lat)])
            lat = cords[i + 2]
            lon = cords[i + 3]
            cell.append([float(lon), float(lat)])
            lat = cords[i + 4]
            lon = cords[i + 5]
            cell.append([float(lon), float(lat)])
            lat = cords[i + 6]
            lon = cords[i + 7]
            cell.append([float(lon), float(lat)])
            cells.append(cell)
        fences.append(cells)
    return fences

def plot_fence(fence, fence_points, subplot, title):
    proj = cimgt.MapQuestOSM()
    ax = plt.subplot(subplot[0], subplot[1], subplot[2], projection=proj.crs)

    ax.add_feature(cartopy.feature.BORDERS, linestyle=':')
    ax.add_feature(cartopy.feature.LAND)
    ax.add_feature(cartopy.feature.COASTLINE)
    ax.add_feature(cartopy.feature.OCEAN)
    ax.add_feature(cartopy.feature.LAKES)
    ax.set_extent([13, 13.8, 52.3, 52.7])

    geoms = []
    geo = Polygon(fence)
    geoms.append(geo)

    geoms2 = []
    for cell in fence_points:
        g = Polygon(cell)
        geoms2.append(g)

    ax.title.set_text(title + "\nNumber of hashes: " + str(len(geoms2)))
    ax.add_geometries(geoms, ccrs.PlateCarree(), facecolor='red',
                      edgecolor='black', alpha=1)

    ax.add_geometries(geoms2, ccrs.PlateCarree(), facecolor='orange',
                      edgecolor='black', alpha=0.2)

if __name__ == "__main__":

    fences = read_fences()
    fence_points_S2_12 = read_fences_point("s2-12/fences_points.txt")
    fence_points_S2_15 = read_fences_point("s2-15/fences_points.txt")
    fence_points_geohash_5 = read_fences_point("geohash-5/fences_points.txt")
    fence_points_geohash_6 = read_fences_point("geohash-6/fences_points.txt")

    for x in range(0, len(fences) - 1):
        plt.figure(figsize=(20, 20))

        plot_fence(fences[x], fence_points_S2_12[x], [2,2,1], "S2 Max Precision: 12, 25bit - Hash")
        plot_fence(fences[x], fence_points_S2_15[x], [2,2,2], "S2 Max Precision: 15, 29bit - Hash")
        plot_fence(fences[x], fence_points_geohash_5[x], [2,2,3], "Geohash Precision: 5, 25bit - Hash")
        plot_fence(fences[x], fence_points_geohash_6[x], [2,2,4], "Geohash Precision: 6, 30bit - Hash")

        #plt.savefig("experiment-1/Test-" + str(x) + ".png")
        plt.show()