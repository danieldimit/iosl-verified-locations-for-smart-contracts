import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt
import matplotlib.pyplot as plt
import cartopy

from shapely .geometry import Polygon

def read_fences():

    f = open("s2/fences.txt", "r")

    fences = list()
    for i in range(0, 100):
        x = f.readline()
        cords = x.split(",")
        latlon = list()
        for i in range(0, len(cords), 2):
            lat = cords[i]
            lon = cords[i+1]
            latlon.append([float(lon),float(lat)])
        fences.append(latlon)
    return fences

def read_fences_point():
    f = open("s2/fences_points.txt", "r")

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

def plot_fence(fence, fence_points):
    proj = cimgt.MapQuestOSM()
    plt.figure(figsize=(20,20))
    ax = plt.axes(projection=proj.crs)
    ax.add_feature(cartopy.feature.BORDERS, linestyle=':')
    ax.add_feature(cartopy.feature.LAND)
    ax.add_feature(cartopy.feature.COASTLINE)
    ax.add_feature(cartopy.feature.OCEAN)
    ax.add_feature(cartopy.feature.LAKES)
    ax.set_extent([13, 14, 52, 53])

    geoms = []
    geo = Polygon(fence)
    geoms.append(geo)

    geoms2 = []
    for cell in fence_points:
        g = Polygon(cell)
        geoms2.append(g)

    ax.add_geometries(geoms, ccrs.PlateCarree(), facecolor='red',
                      edgecolor='black', alpha=1)

    ax.add_geometries(geoms2, ccrs.PlateCarree(), facecolor='orange',
                      edgecolor='black', alpha=0.2)

    plt.show()


if __name__ == "__main__":

    fences = read_fences()
    fence_points = read_fences_point()

    for x in range(0, len(fences)):
        plot_fence(fences[x], fence_points[x])

