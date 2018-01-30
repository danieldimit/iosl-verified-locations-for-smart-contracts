package models;

import java.util.ArrayList;

/**
 * Created by rados on 1/22/2018.
 */
public class Geofence {

    private ArrayList<LatLng> geofence;

    private ArrayList<String> cellIds;

    public ArrayList<LatLng> getGeofence() {
        return geofence;
    }

    public void setGeofence(ArrayList<LatLng> geofence) {
        this.geofence = geofence;
    }

    public ArrayList<String> getCellIds() {
        return cellIds;
    }

    public void setCellIds(ArrayList<String> cellIds) {
        this.cellIds = cellIds;
    }
}
