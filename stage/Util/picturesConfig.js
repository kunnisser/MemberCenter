
class picturesConfig {
    constructor (game) {
        this.init(game);
        this.validate();
    }

    get configHash () {
        return this._configsHash;
    }

    init (game) {
        this._configsHash = game.cache.getJSON('pictures');
        this._keys = Object.keys(this._configsHash);
        this._configArray = this._keys.map((k) => {
           return this._configsHash[k];
        });
       this._configArray.sort(this.sortBy('index'));
    }

    validate () {
        this.validateIndices();
    }

    validateIndices () {
        this._indexArray = this._configArray.map((e) => {
            return e['index'];
        });
        this.noRepeat = this._indexArray.every((i) => {
           return  this._indexArray.indexOf(i) === this._indexArray.lastIndexOf(i);
        });

        console.log(this.noRepeat);
    }

    getPictureConfig (key) {
        return this._configsHash[key];
    }

    getPictureConfigIndex (index) {
        for (let b in this._configsHash) {
           if (this._configsHash.hasOwnProperty(b)) {
               let pc = this._configsHash[b];
               if (pc.index === index) {
               return pc;
            }
           }
        }
    }

    sortBy (key) {
        return (a, b) => {
            return a[key] - b[key];
        }
    }
}

export default picturesConfig;
