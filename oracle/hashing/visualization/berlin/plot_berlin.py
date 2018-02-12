import matplotlib.pyplot as plt

def read_s2_info():
    area_real = 889.338712

    avg_hash_count = []
    avg_percent_area = []

    path = "s2/fences_info_s2_"

    for i in range(6, 21):

        with open(path + str(i) + ".txt") as fp:
            line = fp.readline()
            x = line.rstrip()
            x = x.replace(" ", "")
            x = x.split(",")

            perc_covered = ((float(x[1]) / area_real) * 100.)
            hash_count = float(x[0])

            avg_hash_count.append(hash_count)
            avg_percent_area.append(perc_covered)
    return [avg_percent_area, avg_hash_count]

def read_geohash_info():

    avg_hash_count = []
    avg_percent_area = []

    path = "geohash/fences_info.txt"

    with open(path) as fp:
        line = fp.readline()

        while line:
            x = line.rstrip()
            x = x.replace(" ", "")
            x = x.split(",")
            perc_covered = ((float(x[1]) / float(x[3])) * 100)

            hash_count = float(x[0])

            line = fp.readline()
            avg_hash_count.append(hash_count)
            avg_percent_area.append(perc_covered)

    return [avg_percent_area, avg_hash_count]

def plot_comparison():

    geohash = read_geohash_info()
    s2 = read_s2_info()

    plt.title("Overall hashes needed in comparison to the fence points")
    plt.xlabel("Average Hashes count")
    plt.ylabel("Average area covered in %")

    ax1 = plt.subplot(211)
    ax2 = plt.subplot(212)
    ax3 = ax1.twiny()
    ax4 = ax2.twiny()
    ax1.set_ylim(95, 120)
    ax2.set_ylim(95, 120)
    ax2.set_xlim(0,1000)
    ax1.set_xlim(0,2000)

    ax1.plot(geohash[1], geohash[0], "r", label="geohash")
    ax3.set_xticks(geohash[1])
    ax3.set_xbound(ax1.get_xbound())
    ax3.set_xticklabels(range(4,8))

    ax2.plot(s2[1], s2[0], "b", label="s2")

    ax4.set_xticks(s2[1])
    ax4.set_xbound(ax2.get_xbound())
    ax4.set_xticklabels(range(6, 21))
    ax1.legend(loc='best')
    ax2.legend(loc='best')
    plt.show()

plot_comparison()