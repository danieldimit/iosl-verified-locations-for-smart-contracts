import matplotlib.pyplot as plt


def read_s2_info():
    area_real = []
    with open("s2/f_info.txt") as fp:
        line = fp.readline()

        while line:
            x = line.rstrip()
            x = x.replace(" ", "")
            area_real.append(float(x))

            line = fp.readline()

    avg_hash_count = []
    avg_percent_area = []

    path = "s2/fences_info_s2_"

    for i in range(6, 16):
        count = 0
        hash_count = 0
        area = 0

        with open(path + str(i) + ".txt") as fp:
            line = fp.readline()
            count = 1
            r_count = 1
            hash_count = 0
            under100 = 0
            over_1000 = 0

            while line:
                x = line.rstrip()
                x = x.replace(" ", "")
                x = x.split(",")

                perc_covered = ((float(x[1]) / area_real[count - 1]) * 100.)
                if(perc_covered < 100):
                    under100 += 1
                if (perc_covered > 1000):
                    over_1000 += 1

                if(area_real[count - 1] > 500 and perc_covered > 100):
                    area += perc_covered
                    r_count += 1
                    hash_count += float(x[0])

                line = fp.readline()
                count += 1

            print area / r_count
            print under100
            print over_1000
            avg_hash_count.append(hash_count / r_count)
            avg_percent_area.append(area / r_count)

    return [avg_percent_area, avg_hash_count]


def read_geohash_info():

    avg_hash_count = []
    avg_percent_area = []

    path = "geohash/fences_info_"

    for i in range(3, 7):
        rc = 0
        hash_count = 0
        area = 0

        with open(path + str(i) + ".txt") as fp:
            line = fp.readline()
            count = 1
            hash_count = 0

            while line:
                x = line.rstrip()
                x = x.replace(" ", "")
                x = x.split(",")

                perc_covered = ((float(x[1]) / float(x[3])) * 100)
                if(float(x[3]) > 500 and perc_covered > 100):
                    area += perc_covered
                    hash_count += float(x[0])
                    rc += 1
                count += 1

                line = fp.readline()

            avg_hash_count.append(hash_count / rc)
            avg_percent_area.append(float(area / float(rc)))

    return [avg_percent_area, avg_hash_count]

def plot_comparison():

    geohash = read_geohash_info()
    s2 = read_s2_info()

    plt.title("Overall hashes needed in comparison to the fence points")
    plt.xlabel("Average Hashes count")
    plt.ylabel("Average area covered")
    plt.ylim(0, 200)
    plt.plot(geohash[1], geohash[0], "r", label="geohash")
    plt.plot(s2[1], s2[0], "b", label="s2")
    plt.legend(bbox_to_anchor=(1, 1), loc=2, borderaxespad=0.)
    plt.show()

plot_comparison()
