# Usage

## Geohash generator

Usage:

```bash
python calculate_geohash.py fences.txt 5 6 --points
```

The first argument should be a path to a file containing a geofence with each point represented
as (longitude, latitude) and the points should be oriented clockwise.

The second and third argument are the minimum and maximum precision. The program will iterate through all numbers
between the min and maximum and generate the geohashed fences for them. 

The last argument is a flag to specify whether to save the points of each geohash, so that you can also plot 
the geohashes fence.

Output:

In the *geohash_info.txt* the program saves for each precision the average area covered in percentage and the average number of cells used.

In the *fences_points.txt* the program saves for each geohash the four edges.

## Cell plotting

Usage:

```bash
python plot_cells.py fences.txt fences_points.txt [12.9,13.8,52,53]
```

The first and the second argument are the path to the real fences and the path to coordinates of the 
geohashes. The second can be generated following the above explained steps

The third argument is the extent - the region in which the fences lie, so that they can be visible in the plot. The default extent is set to berlin.

## Coverage-Hash comparison