import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt
import matplotlib.pyplot as plt
import cartopy
import cartopy.io.shapereader as shpreader

from shapely .geometry import Polygon

def read_fences():


    f = open("fences.txt", "r")

    fences = list()
    for i in range(0, 8):
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
    ax.set_extent([12.9, 13.9, 52.2, 52.8])
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

def plot_fence_info():

    fence_edges = []
    bits_geohash = []
    bits_s2_14 = []
    bits_s2_15 = []

    geofence_area = []
    geohash_area = []
    s2_14_area = []
    s2_15_area = []

    geohash_hashes = []
    s2_14_hashes = []
    s2_15_hashes = []

    f = open("fences_info/fences_info.txt", "r")

    for i in range(0, 10):
        x = f.readline()
        x = x.rstrip()
        x = x.replace(" ", "")
        x = x.split(",")

        if len(x) > 1:
            fence_edges.append(float(x[4]))
            bits_geohash.append(float(x[2]))
            geohash_hashes.append(float(x[0]))

            geofence_area.append(float(x[3]))
            geohash_area.append(float(x[1]))

    f = open("fences_info/fences_info_s2_14.txt", "r")

    for i in range(0, 10):
        x = f.readline()
        x = x.rstrip()
        x = x.replace(" ", "")
        x = x.split(",")

        if len(x) > 1:
            bits_s2_14.append(float(x[2]))
            s2_14_area.append(float(x[1]))
            s2_14_hashes.append(float(x[0]))

    f = open("fences_info/fences_info_s2_15.txt", "r")

    for i in range(0, 10):
        x = f.readline()
        x = x.rstrip()
        x = x.replace(" ", "")
        x = x.split(",")

        if len(x) > 1:
            bits_s2_15.append(float(x[2]))
            s2_15_area.append(float(x[1]))
            s2_15_hashes.append(float(x[0]))

    plt.title("Overall bits needed in comparison to the fence points")
    plt.xlabel("Fence Points")
    plt.ylabel("Bits needed")
    plt.plot(fence_edges[:8], bits_geohash[:8], "r", label="geohash")
    plt.plot(fence_edges[:8], bits_s2_14[:8], "b", label="s2 14")
    plt.plot(fence_edges[:8], bits_s2_15[:8], "g", label="s2 15")
    plt.legend(bbox_to_anchor=(1, 1), loc=2, borderaxespad=0.)
    plt.savefig("experiment-1/bits.png")
    plt.show()

    plt.title("Overall hashes needed in comparison to the fence points")
    plt.xlabel("Fence Points")
    plt.ylabel("Hashes needed")
    plt.plot(fence_edges[:8], geohash_hashes[:8], "r", label="geohash")
    plt.plot(fence_edges[:8], s2_14_hashes[:8], "b", label="s2 14")
    plt.plot(fence_edges[:8],s2_15_hashes[:8], "g", label="s2 15")
    plt.legend(bbox_to_anchor=(1, 1), loc=2, borderaxespad=0.)
    plt.savefig("experiment-1/hashes.png")
    plt.show()

    for i in range(0, len(geofence_area)):
        geohash_area[i] = geohash_area[i] / geofence_area[i] * 100
        s2_14_area[i] = s2_14_area[i] / geofence_area[i] * 100
        s2_15_area[i] = s2_15_area[i] / geofence_area[i] * 100

    plt.title("Area covered")
    plt.xlabel("Fence Points")
    plt.ylabel("% of Area covered")
    plt.plot(fence_edges[:8], geohash_area[:8], "r", label="geohash")
    plt.plot(fence_edges[:8], s2_14_area[:8], "b", label="s2 14")
    plt.plot(fence_edges[:8], s2_15_area[:8], "g", label="s2 15")
    plt.legend(bbox_to_anchor=(1, 1), loc=2, borderaxespad=0.)
    plt.savefig("experiment-1/area.png")
    plt.show()


if __name__ == "__main__":

    plot_fence_info()

    fences = read_fences()
    fence_points_S2_13 = read_fences_point("s2-13/fences_points.txt")
    fence_points_S2_14 = read_fences_point("s2-14/fences_points.txt")
    fence_points_S2_15 = read_fences_point("s2-15/fences_points.txt")
    fence_points_geohash_6 = read_fences_point("geohash-6/fences_points.txt")

    for x in range(0, len(fences) - 1):
        plt.figure(figsize=(20, 20))

        plot_fence(fences[x], fence_points_S2_13[x], [2,2,1], "S2 Max Precision: 13, Max precision - 1.37 km2")
        plot_fence(fences[x], fence_points_S2_14[x], [2,2,2], "S2 Max Precision: 14, Max precision - 0.32 km2")
        plot_fence(fences[x], fence_points_S2_15[x], [2,2,3], "S2 Max Precision: 15,  Max precision - 0.08 km2")
        plot_fence(fences[x], fence_points_geohash_6[x], [2,2,4], "Geohash Precision: 6, 30bit - Hash, Max precision - 0.76 km2")

        plt.savefig("experiment-1/Test-" + str(x) + ".png")
        #plt.show()