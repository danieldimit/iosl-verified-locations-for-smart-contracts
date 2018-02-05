import matplotlib.pyplot as plt

def read():
    with open("cell_distribution.txt") as fp:
        line = fp.readline()

        u10 = []
        o10 = []
        o15 = []
        o20 = []

        while line:

            u_10 = 0.0
            o_10 = 0.0
            o_15 = 0.0
            o_20 = 0.0

            x = line.rstrip()
            x = x.replace(" ", "").replace("{","").replace("}", "")
            x = x.split(",")

            for pair in x:
                kp = pair.split("=")
                key = int(kp[0])
                value = float(kp[1])
                if key < 10:
                    u_10 += value
                elif key < 15:
                    o_10 += value
                elif key < 20:
                    o_15 += value
                else:
                    o_20 += value

            u10.append(u_10)
            o10.append(o_10)
            o15.append(o_15)
            o20.append(o_20)

            line = fp.readline()

        return u10, o10, o15, o20


if __name__ == "__main__":
    info = read()

    label = range(100, len(info[0])*100+100, 100)
    x2 = range(100+10, len(info[0])*100+100, 100)
    width = 25

    ax1 = plt.subplot(221)
    ax2 = plt.subplot(222)
    ax3 = plt.subplot(223)
    ax4 = plt.subplot(224)

    ax1.bar(label, info[0], width, color="b", label="Preicision <10")
    ax2.bar(label, info[1], width, color="orange", label="Precision >=10 and <20")
    ax3.bar(label, info[2], width, color="green", label="Preicsion >=15 < 20")
    ax4.bar(label, info[3], width, color="r", label="Preicsion >20")
    ax1.legend(loc='best')
    ax2.legend(loc='best')
    ax3.legend(loc='best')
    ax4.legend(loc='best')
    plt.show()