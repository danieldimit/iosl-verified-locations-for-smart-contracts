import matplotlib.pyplot as plt

def read(path):
    mean_hash_count = []
    mean_area_covered = []

    with open(path) as fp:
        line = fp.readline()
        while line:
            x = line.rstrip()
            x = x.replace(" ", "")
            x = x.split(",")
            mean_hash_count.append(float(x[0]))
            mean_area_covered.append(float(x[1]))

            line = fp.readline()


    return [mean_hash_count, mean_area_covered]


if __name__ == "__main__":

    s2_path = "info/s2_info.txt"
    geohash_path = "info/geohash_info.txt"

    s2_info = read(s2_path)
    geohash_info = read(geohash_path)

    ax1 = plt.subplot(211)
    ax2 = plt.subplot(212)
    ax1.set_ylim(97, 110)
    ax2.set_ylim(95, 120)

    ax1.set_xlabel("Average Hashes count")
    ax1.set_ylabel("Average area covered in %")

    ax2.set_xlabel("Average Hashes count")
    ax2.set_ylabel("Average area covered in %")

    ax1.scatter(geohash_info[0], geohash_info[1], c="r", label="geohash")

    ax2.scatter(s2_info[0], s2_info[1], c="b", label="s2")
    ax1.legend(loc='best')
    ax2.legend(loc='best')
    plt.show()
