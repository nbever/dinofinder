export class FossilOccurence {
    
    _id = undefined;
    _taxa_name = '';
    _estimate_occurence = 0;
    _country = '';
    _area = '';
    _area_details = '';
    _longitude = 0;
    _latitude = 0;

    initialize( raw_data ){
        this._id = raw_data.oid;
        this._taxa_name = raw_data.tna;
        this._estimate_occurence = ((raw_data.eag - raw_data.lag)/2.0) + raw_data.lag;
        this._area = raw_data.gsc;
        this._country = raw_data.cc2;
        this._area_details = raw_data.ggc;
        this._longitude = raw_data.lng;
        this._latitude = raw_data.lat;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._taxa_name;
    }

    get country(){
        return this._country;
    }

    get area(){
        return this._area;
    }

    get area_details(){
        return this._area_details;
    }

    get longitude(){
        return this._longitude;
    }

    get latitude(){
        return this._latitude;
    }
}