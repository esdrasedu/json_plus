"use strict";

(function(){

    var JSONPLUS = {};

    JSONPLUS.stringify = function( value, filter, space ){
        return JSON.stringify( value, function( key, value ){
            if( typeof filter == "function" ){
                value = filter(key, value);
            }
            if( value instanceof Array ){
                var properties = {};
                var array_root = [];
                var hasProperty = false;
                for ( var key in value ) {
                    if( value.hasOwnProperty(key) ){
                        if( isNaN(key) ){
                            properties[key] = value[key];
                            hasProperty = true;
                        } else {
                            array_root[key] = value[key];
                        }
                    }
                }
                if( hasProperty ){
                    properties['$ArrayWithProperties'] = array_root;
                    return properties;
                }
            }
            return value;
        }, space);
    };

    JSONPLUS.parse = function( value, filter ){
        return JSON.parse( value, function( name, value ){
            if( value.hasOwnProperty('$ArrayWithProperties') ){
                var value_new = value['$ArrayWithProperties'];
                delete value['$ArrayWithProperties'];
                for ( var key in value ) {
                    value_new[key] = value[key];
                }
                return value_new;
            }
            if( typeof filter == "function" ){
                value = filter(name, value);
            }
            return value;
        });
    };

    if( typeof module === 'object' ){
        //NodeJS
        module.exports = JSONPLUS;
    } else if( typeof window === 'object' ){
        //Browser
        window.JSONPLUS = JSONPLUS;
    }

})();
