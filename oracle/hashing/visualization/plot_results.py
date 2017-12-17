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

def plot_fence(fence):
    proj = cimgt.MapQuestOSM()
    ax = plt.axes(projection=proj.crs)
    ax.add_feature(cartopy.feature.BORDERS, linestyle=':')
    ax.add_feature(cartopy.feature.LAND)
    ax.add_feature(cartopy.feature.COASTLINE)
    ax.add_feature(cartopy.feature.OCEAN)
    ax.set_extent([12, 14, 51, 53])

    geoms = []
    geo = Polygon(fence)
    geoms.append(geo)
    ax.add_geometries(geoms, ccrs.PlateCarree(), facecolor='red',
                      edgecolor='black', alpha=0.4)

    plt.show()


if __name__ == "__main__":

    fences = read_fences()

    for fence in fences:
        plot_fence(fence)

