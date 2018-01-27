package api;

import com.google.common.geometry.*;
import models.Geofence;
import models.LatLon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by rados on 1/22/2018.
 */
@RestController
@RequestMapping("/")
public class S2Rest {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(
            value = "{cellId}",
            method = RequestMethod.GET,
            produces = {"application/json"})
    @ResponseBody
    public ArrayList<LatLon> converGeofenceToS2Polygons(
            @PathVariable("cellId") String cellId){

        ArrayList<LatLon> response = new ArrayList<>();

        S2CellId s2CellId = new S2CellId(Long.valueOf(cellId));
        S2Cell s2Cell = new S2Cell(s2CellId);

        for(int i=0; i < 4; i++){
            S2Point p = s2Cell.getVertex(i);
            S2LatLng latLng = new S2LatLng(p);
            LatLon latLon = new LatLon();
            latLon.setLat(latLng.latDegrees());
            latLon.setLon(latLng.lngDegrees());
            response.add(latLon);
        }

        return response;
    }

    @RequestMapping(
            value = "polygon",
            method = RequestMethod.POST,
            produces = {"application/json"},
            consumes = {"application/json"})
    @ResponseBody
    public Geofence converGeofenceToS2Polygons(
            @RequestBody Geofence geofence){

        Geofence response = new Geofence();
        ArrayList<String> cellIds = new ArrayList<>();
        ArrayList<LatLon> polygonPoints = new ArrayList<>();

        List<S2Point> points = new ArrayList<>();

        for(LatLon point : geofence.getGeofence()){
            points.add(0, S2LatLng.fromDegrees(point.getLat(), point.getLon()).toPoint());
        }

        S2Loop loop = new S2Loop(points);
        loop.normalize();
        S2Polygon region = new S2Polygon(loop);

        S2RegionCoverer coverer = new S2RegionCoverer();
        coverer.setMaxLevel(15);
        coverer.setMaxCells(1000);
        S2CellUnion union = coverer.getCovering(region);

        log.info(String.valueOf(union.cellIds().size()));

        for(S2CellId id : union.cellIds()){
            S2Cell s2Cell = new S2Cell(id);
            cellIds.add(String.valueOf(id.id()));

            for(int j = 0; j < 4; j++){
                S2Point p = s2Cell.getVertex(j);
                S2LatLng latLng = new S2LatLng(p);
                LatLon latLon = new LatLon();
                latLon.setLat(latLng.latDegrees());
                latLon.setLon(latLng.lngDegrees());
                polygonPoints.add(latLon);
            }
        }

        response.setCellIds(cellIds);
        response.setGeofence(polygonPoints);

        return response;
    }


}
