package api;

import com.google.common.geometry.*;
import models.Geofence;
import models.LatLon;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by rados on 1/22/2018.
 */
@RestController
@RequestMapping("/")
public class S2Rest {

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Geofence converGeofenceToS2Polygons(
            @RequestBody Geofence geofence){

        Geofence resposnse = new Geofence();
        ArrayList<String> cellIds = new ArrayList<>();
        ArrayList<LatLon> polygonPoints = new ArrayList<>();

        List<S2Point> points = new ArrayList<>();

        for(LatLon point : geofence.getGeofence()){
            points.add(0, S2LatLng.fromDegrees(point.getLat(), point.getLon()).toPoint());
        }

        S2Loop loop = new S2Loop(points);
        S2Polygon region = new S2Polygon(loop);

        S2RegionCoverer coverer = new S2RegionCoverer();
        coverer.setMaxLevel(15);
        coverer.setMaxCells(100000);
        S2CellUnion union = coverer.getCovering(region);

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

        resposnse.setCellIds(cellIds);
        resposnse.setGeofence(polygonPoints);

        return new Geofence();
    }


}
