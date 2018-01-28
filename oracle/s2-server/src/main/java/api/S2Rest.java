package api;

import com.google.common.geometry.*;
import models.Geofence;
import models.S2Geofence;
import models.LatLng;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by rados on 1/22/2018.
 */
@CrossOrigin
@RestController
@RequestMapping("/")
public class S2Rest {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(
            value = "{convertS2ToBoundingLatLonPolygon}",
            method = RequestMethod.GET,
            produces = {"application/json"})
    @ResponseBody
    public ArrayList<LatLng> converGeofenceToS2Polygons(
            @RequestParam("cellId") String cellId){
        System.out.println(cellId);
        ArrayList<LatLng> response = new ArrayList<>();

        S2CellId s2CellId = new S2CellId(Long.valueOf(cellId));
        S2Cell s2Cell = new S2Cell(s2CellId);

        for(int i=0; i < 4; i++){
            S2Point p = s2Cell.getVertex(i);
            S2LatLng latLng = new S2LatLng(p);
            LatLng latLon = new LatLng();
            latLon.setLat(latLng.latDegrees());
            latLon.setLng(latLng.lngDegrees());
            response.add(latLon);
        }

        return response;
    }

    @RequestMapping(
            value = "convertGeofenceToS2Polygons",
            method = RequestMethod.POST,
            produces = {"application/json"},
            consumes = {"application/json"})
    @ResponseBody
    public S2Geofence converGeofenceToS2Polygons(
            @RequestBody Geofence geofence, @RequestParam("maxLevel") int maxLevel){

        S2Geofence response = new S2Geofence();
        ArrayList<String> cellIds = new ArrayList<>();
        ArrayList<LatLng[]> polygonPoints = new ArrayList<>();

        List<S2Point> points = new ArrayList<>();

        for(LatLng point : geofence.getGeofence()){
            points.add(0, S2LatLng.fromDegrees(point.getLat(), point.getLng()).toPoint());
        }

        S2Loop loop = new S2Loop(points);
        loop.normalize();
        S2Polygon region = new S2Polygon(loop);

        S2RegionCoverer coverer = new S2RegionCoverer();
        coverer.setMaxLevel(maxLevel);
        coverer.setMaxCells(1000);
        S2CellUnion union = coverer.getCovering(region);

        log.info(String.valueOf(union.cellIds().size()));

        for(S2CellId id : union.cellIds()){
            S2Cell s2Cell = new S2Cell(id);
            cellIds.add(String.valueOf(id.id()));
            LatLng[] tempPolyArr = new LatLng[4];

            for(int j = 0; j < 4; j++){
                S2Point p = s2Cell.getVertex(j);
                S2LatLng latLng = new S2LatLng(p);
                LatLng latLon = new LatLng();
                latLon.setLat(latLng.latDegrees());
                latLon.setLng(latLng.lngDegrees());
                tempPolyArr[j] = latLon;
            }
            polygonPoints.add(tempPolyArr);
        }

        response.setCellIds(cellIds);
        response.setGeofence(polygonPoints);

        return response;
    }


}
