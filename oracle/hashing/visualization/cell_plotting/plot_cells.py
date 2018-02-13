import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt
import matplotlib.pyplot as plt
import cartopy
import cartopy.io.shapereader as shpreader

import sys

from shapely.geometry import Polygon


def read_fences(path="fences.txt"):
    fences = list()
    with open(path) as fp:
        line = fp.readline()
        while line:
            x = line.replace("(", "").replace(")", "").replace("[", "").replace("]", "")
            cords = x.split(",")
            latlon = list()
            for i in range(0, len(cords), 2):
                latlon.append([float(cords[i]), float(cords[i + 1])])
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


def read_extent(string_extent):
    ext = string_extent.replace("[", "").replace("]", "").split(",")
    if len(ext) != 4:
        print("Parsing extent failed: Specify exactly 4 numbers")
        print(
            "Usage: <fences path> <hashes fence points path> <optional extent of map in the following format [min_longitude,max_longitude,min_latitude,max_latitude] (no spaces)")
        return None
    extent = []
    for x in ext:
        try:
            extent.append(float(x))
        except:
            print("Parsing extent failed: Could not parse one of the numbers in the extent")
            print(
            "Usage: <fences path> <hashes fence points path> <optional extent of map in the following format [min_longitude,max_longitude,min_latitude,max_latitude] (no spaces)")
            return None
    return extent


if __name__ == "__main__":

    args = sys.argv
    if len(args) < 3:
        print(
        "Usage: <fences path> <hashes fence points path> <optional extent of map in the following format [min_longitude,max_longitude,min_latitude,max_latitude] (no spaces)")
        exit(1)
    extent = None
    if len(args) >= 4:
        extent = read_extent(args[3])

    fences_path = args[1]
    hashed_fences_path = args[2]

    fences = read_fences(fences_path)
    fences_points = read_fences_point(hashed_fences_path)

    for x in range(0, len(fences)):
        plt.figure(figsize=(20, 20))
        if extent != None:
            plot_fence(fences[x], fences_points[x], [1, 1, 1], extent)
        else:
            plot_fence(fences[x], fences_points[x], [1, 1, 1])
        plt.savefig("plot-" + str(x) + ".png")
