import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt
import matplotlib.pyplot as plt
import cartopy
import cartopy.io.shapereader as shpreader

import sys

from shapely .geometry import Polygon

def read_fences(path="fences.txt"):
    fences = list()
    with open(path) as fp:
        line = fp.readline()
        while line:
            x = line.replace("(", "").replace(")", "").replace("[", "").replace("]", "")
            cords = x.split(",")
            latlon = list()
            for i in range(0, len(cords), 2):
                latlon.append([float(cords[i]), float(cords[i+1])])
            fences.append(latlon)
            line = fp.readline()
    return fences

def read_fences_point(path):

    fences = list()
    with open(path) as fp:
        line = fp.readline()
        while line:
            x = line.replace("(", "").replace(")", "").replace("[", "").replace("]", "")
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
            line = fp.readline()
    return fences

def plot_fence(fence, fence_points, subplot, extent=[13.0, 13.8, 52.3, 52.7]):

    proj = cimgt.MapQuestOSM()
    ax = plt.subplot(subplot[0], subplot[1], subplot[2], projection=proj.crs)

    ax.add_feature(cartopy.feature.BORDERS, linestyle=':')
    ax.add_feature(cartopy.feature.LAND)
    ax.add_feature(cartopy.feature.COASTLINE)
    ax.add_feature(cartopy.feature.OCEAN)
    ax.add_feature(cartopy.feature.LAKES)
    ax.set_extent(extent)
    geoms = []
    geo = Polygon(fence)
    geoms.append(geo)

    geoms2 = []
    for cell in fence_points:
        g = Polygon(cell)
        geoms2.append(g)

    ax.title.set_text("Number of hashes: " + str(len(geoms2)))
    ax.add_geometries(geoms, ccrs.PlateCarree(), facecolor='red',
                      edgecolor='black', alpha=1)

    ax.add_geometries(geoms2, ccrs.PlateCarree(), facecolor='orange',
                      edgecolor='black', alpha=0.2)

if __name__ == "__main__":

    args = sys.argv
    if len(args) < 3:
        print("You must provide at least the hashes fence points and the fence points")
        exit(1)
    fences_path = args[1]
    hashed_fences_path = args[2]

    fences = read_fences(fences_path)
    fences_points = read_fences_point(hashed_fences_path)

    for x in range(0, len(fences)):
        plt.figure(figsize=(20, 20))
        plot_fence(fences[x], fences_points[x], [1,1,1])
        plt.savefig("plot-" + str(x) + ".png")