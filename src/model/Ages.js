export class TimeSpan {
    
    _name = undefined;
    _start = 0;
    _end = 0;

    constructor( name, start, end ){
        
        this.name = name;
        this.start = start;
        this.end = end;
    }

    get name(){ return this._name; }
    set name( name ){ this._name = name; }

    get start(){ return this._start; }
    set start( start ){ this._start = start; }

    get end(){ return this._end; }
    set end( end ){ this._end = end; }

    get key(){
        return this.name + ':' + this.start + ':' + this.end;
    }
}

export class Era extends TimeSpan {
    _periods = []
    
    addPeriods( ...periods ){
        
        this.periods.push( ...periods );
    }

    get periods(){ 
        return this._periods;
    }
}

export class Period extends TimeSpan {
    
    _epochs = [];

    addEpochs( ...epochs ){
        
        this._epochs.push( ...epochs );
    }

    get epochs(){
        return this._epochs;
    }
}

export class Epoch extends TimeSpan {
    
}

export function buildAges(){
    var ages = [];

    var paleo = new Era( 'Paleozoic', 542.0, 251.0 );
    var mesozoic = new Era( 'Mesozoic', 251.0, 65.5 );
    var cenozoic = new Era( 'Cenozoic', 65.5, 0 );

    var cambrian = new Period( 'Cambrian', 542.0, 488.3 );
    var ordovician = new Period( 'Ordovician', 488.3, 443.7 );
    var silurian = new Period( 'Silurian', 443.7, 416.0 );
    var devonian = new Period( 'Devonian', 416.0, 359.2 );
    var carboniferous = new Period( 'Carbonifeous', 359.2, 299.0 );
    var permian = new Period( 'Permian', 299.0, 251.0 );

    var terreneuvian = new Epoch( 'Terreneuvian', 542.0, 521.0 );
    var series_2 = new Epoch( 'Series 2', 521.0, 510.0 );
    var series_3 = new Epoch( 'Series 3', 510.0, 499.0 );
    var furongian = new Epoch( 'Furongian', 499.0, 488.3 );

    cambrian.addEpochs( terreneuvian, series_2, series_3, furongian );

    var lower_ord = new Epoch( 'Lower', 488.3, 471.8 );
    var middle_ord = new Epoch( 'Middle', 471.8, 460.9 );
    var upper_ord = new Epoch( 'Upper', 460.9, 443.7 );

    ordovician.addEpochs( lower_ord, middle_ord, upper_ord );

    var llandovery = new Epoch( 'Llandovery', 443.7, 428.2 );
    var wenlock = new Epoch( 'Wenlock', 428.2, 422.9 );
    var ludlow = new Epoch( 'Ludlow', 422.9, 418.7 );
    var pridoli = new Epoch( 'Pridoli', 418.7, 416.0 );

    silurian.addEpochs( llandovery, wenlock, ludlow, pridoli );

    var lower_dev = new Epoch( 'Lower', 416.0, 397.5 );
    var middle_dev = new Epoch( 'Middle', 397.5, 385.3 );
    var upper_dev = new Epoch( 'Upper', 385.3, 359.2 );

    devonian.addEpochs( lower_dev, middle_dev, upper_dev );

    var miss = new Epoch( 'Mississippian', 359.2, 318.1 );
    var penn = new Epoch( 'Pennsylvanian', 318.1, 299.0 );

    carboniferous.addEpochs( miss, penn );

    var cisuralian = new Epoch( 'Cisuralian', 299.0, 270.6 );
    var guadalupian = new Epoch( 'Guadalupian', 270.6, 260.4 );
    var lopingian = new Epoch( 'Lopingian', 260.4, 251.0 );

    permian.addEpochs( cisuralian, guadalupian, lopingian );

    paleo.addPeriods( permian, carboniferous, devonian, silurian, ordovician, cambrian );

    var triassic = new Period( 'Triassic', 251.0, 199.6 );
    var jurassic = new Period( 'Jurassic', 199.6, 145.5 );
    var cretaceous = new Period( 'Cretaceous', 145.5, 65.5 );

    var lower_tri = new Epoch( 'Lower', 251.0, 245.9 );
    var middle_tri = new Epoch( 'Middle', 245.9, 228.7 );
    var upper_tri = new Epoch( 'Upper', 228.7, 199.6 );

    triassic.addEpochs( lower_tri, middle_tri, upper_tri );

    var lower_jur = new Epoch( 'Lower', 199.6, 175.6 );
    var middle_jur = new Epoch( 'Middle', 175.6, 161.2 );
    var upper_jur = new Epoch( 'Upper', 161.2, 145.5 );

    jurassic.addEpochs( lower_jur, middle_jur, upper_jur );

    var lower_cret = new Epoch( 'Lower', 145.5, 99.6 );
    var upper_cret = new Epoch( 'Upper', 99.6, 65.5 );

    cretaceous.addEpochs( lower_cret, upper_cret );

    mesozoic.addPeriods( triassic, jurassic, cretaceous );

    var paleogene = new Period( 'Paleogene', 65.5, 23.03 );
    var neogene = new Period( 'Neogene', 23.03, 2.588 );
    var quaternary = new Period( 'Quaternary', 2.588, 0 );

    var paleocene = new Epoch( 'Paleocene', 65.5, 55.8 );
    var eocene = new Epoch( 'Eocene', 55.8, 33.9 );
    var oligocene = new Epoch( 'Oligocene', 33.9, 23.03 );

    paleogene.addEpochs( paleocene, eocene, oligocene );

    var miocene = new Epoch( 'Miocene', 23.03, 5.332 );
    var pliocene = new Epoch( 'Pliocene', 5.332, 2.588 );

    neogene.addEpochs( pliocene, miocene );

    var pleistocene = new Epoch( 'Pleistocene', 2.588, 0.011 );
    var holocene = new Epoch( 'Holocene', 0.011, 0 );

    quaternary.addEpochs( pleistocene, holocene );

    cenozoic.addPeriods( paleogene, neogene, quaternary );

    ages.push( paleo, mesozoic, cenozoic );
    
    return ages;
}