package com.google.common.geometry.experiment;

import com.google.common.geometry.*;
import com.sun.deploy.util.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * Created by rados on 12/12/2017.
 */
public class Experiment {

    private static final Logger log = Logger.getLogger(S2PolygonBuilder.class.getCanonicalName());

    /*
    private double calculateArea(List<double[]> geofence_normal){
        //calculate area for irregular polygon
        List<double[]> geofence = geofence_normal.revers();

        List<double[]> polygon = [];
        for (var t = 0; t < geofence.size(); t++) {

            polygon.add({lng: geofence[t][1], lat: geofence[t][0]});
        }
        return geoarea(polygon) / 1000000;
    }*/

    private static double[] getNewPointFromDistanceBearing(double[] a, double distance, double bearing) {

        double lat = a[0];
        double lon = a[1];
        double dist = distance / 6371;
        double brng = deg2rad(bearing);

        double lat1 = deg2rad(lat);
        double lon1 = deg2rad(lon);

        double lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

        double lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                        Math.cos(lat1),
                Math.cos(dist) - Math.sin(lat1) *
                        Math.sin(lat2));

        return new double[]{rad2deg(lat2), rad2deg(lon2)};
    }

    private static double deg2rad(double deg) {
        return deg * (Math.PI/180);
    }

    private static double rad2deg(double rad) {
        return rad * 180 / Math.PI;
    }


    private static List<double[]> generateRandomGeofence(){

        double maxBearing = 45;

        double[] center = {52.520007, 13.404954};

        List<double[]> geofence = new ArrayList<>();
        double bearing = 0;

        while(bearing < 360 - maxBearing){
            double newBearing = Math.floor(Math.random() * maxBearing) + bearing;
            while(newBearing > 360) {
                newBearing = Math.floor(Math.random() * maxBearing) + bearing;
            }
            double distance = Math.floor(Math.random() * 10) + 10;
            geofence.add(0, getNewPointFromDistanceBearing(center, distance, newBearing));
            bearing = newBearing;
        }
        return geofence;
    }

    private static long removeZeros(long id){
        String binary = Long.toBinaryString(id);
        int x;
        for(x = binary.toCharArray().length - 1; x > -1; x--){
            if(binary.charAt(x) != '0'){
                break;
            }
        }
        return id >> (x - 1);
    }

    static String fenceToString(List<double[]> numbers) {
        StringBuilder builder = new StringBuilder();
        // Append all Integers in StringBuilder to the StringBuilder.
        for (double[] number : numbers) {
            builder.append(number[0]);
            builder.append(",");
            builder.append(number[1]);
            builder.append(",");
        }
        // Remove last delimiter with setLength.
        builder.setLength(builder.length() - 1);
        return builder.toString();
    }

    static String convertToString(List<Long> numbers) {
        StringBuilder builder = new StringBuilder();
        // Append all Integers in StringBuilder to the StringBuilder.
        for (long number : numbers) {
            builder.append(number);
            builder.append(",");
        }
        // Remove last delimiter with setLength.
        builder.setLength(builder.length() - 1);
        return builder.toString();
    }


    private static int findCover() throws IOException {

        //S2LatLngRect region = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(-51.264871, -30.241701),
          //              S2LatLng.fromDegrees(-51.04618, -30.000003));

        List<S2Point> points = new ArrayList<>();

        List<double[]> fence = generateRandomGeofence();

        for(double[] point : fence){
            points.add(S2LatLng.fromDegrees(point[0], point[1]).toPoint());
        }

        S2Loop loop = new S2Loop(points);
        S2Polygon region = new S2Polygon(loop);
        //log.info(String.valueOf(region.getArea()));

        S2RegionCoverer coverer = new S2RegionCoverer();
        coverer.setMaxLevel(12);
        coverer.setMaxCells(100000);
        S2CellUnion union = coverer.getCovering(region);

        BufferedWriter writer_fences = new BufferedWriter(new FileWriter( "fences.txt", true));
        BufferedWriter writer_fences_hashed = new BufferedWriter(new FileWriter( "fences_hashed.txt", true));

        List<Long> ids = new ArrayList<Long>();
        for(S2CellId id : union.cellIds()){
            S2Cell s2Cell = new S2Cell(id);
            //log.info(s2Cell.getCenter().toDegreesString());
            ids.add(removeZeros(id.id()));
            log.info(String.valueOf(removeZeros(id.id())));
        }
        writer_fences.write(fenceToString(fence));
        writer_fences.newLine();
        writer_fences.close();

        writer_fences_hashed.write(convertToString(ids));
        writer_fences_hashed.newLine();
        writer_fences_hashed.close();
        return union.size();
    }

    public static void main(String[] args) throws IOException {
        double sum = 0;
        for(int i = 0; i < 100; i++){
            sum += findCover();
        }
        log.info(String.valueOf("Number of cells " + sum / 100));
        log.info(String.valueOf("Mean area covered " + (sum / 100) * 6));
    }
}
