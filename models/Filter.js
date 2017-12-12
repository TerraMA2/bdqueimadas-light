"use strict";

/**
 * Filter model, which contains filter related database manipulations.
 * @class Filter
 *
 * @author Jean Souza [jean.souza@funcate.org.br]
 *
 * @property {object} memberPath - 'path' module.
 * @property {json} memberFilterConfig - Filter configuration.
 * @property {json} memberTablesConfig - Tables configuration.
 * @property {object} memberUtils - 'Utils' model.
 * @property {object} memberPgPool - PostgreSQL connection pool.
 */
var Filter = function() {

  // 'path' module
  var memberPath = require('path');
  // Filter configuration
  var memberFilterConfig = require(memberPath.join(__dirname, '../configurations/Filter.json'));
  // Tables configuration
  var memberTablesConfig = require(memberPath.join(__dirname, '../configurations/Tables.json'));
  // 'Utils' model
  var memberUtils = new (require('./Utils.js'))();
  // PostgreSQL connection pool
  var memberPgPool = require('../pg');

  /**
   * Returns a list of countries filtered by the received states ids.
   * @param {array} states - States ids
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getCountriesByStates
   * @memberof Filter
   * @inner
   */
  this.getCountriesByStates = function(states, callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var parameter = 1;
        var params = [];

        // Creation of the query
        var query = "select a." + memberTablesConfig.Countries.IdFieldName + " as id, a." + memberTablesConfig.Countries.NameFieldName + " as name, a." +
                    memberTablesConfig.Countries.BdqNameFieldName + " as bdq_name from " +
                    memberTablesConfig.Countries.Schema + "." + memberTablesConfig.Countries.TableName + " a inner join " + memberTablesConfig.States.Schema + "." +
                    memberTablesConfig.States.TableName + " b on (a." + memberTablesConfig.Countries.IdFieldName + " = b." + memberTablesConfig.Countries.IdFieldName +
                    ") where b." + memberTablesConfig.States.IdFieldName + " in (";

        for(var i = 0, statesLength = states.length; i < statesLength; i++) {
          query += "$" + (parameter++) + ",";
          params.push(states[i]);
        }

        query = query.substring(0, (query.length - 1)) + ");";

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns a list of countries.
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getCountries
   * @memberof Filter
   * @inner
   */
  this.getCountries = function(callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        // Creation of the query
        var query = "select " + memberTablesConfig.Countries.IdFieldName + " as id, " + memberTablesConfig.Countries.NameFieldName + " as name from " + memberTablesConfig.Countries.Schema + "." + memberTablesConfig.Countries.TableName + " order by " + memberTablesConfig.Countries.NameFieldName + " asc;";

        // Execution of the query
        client.query(query, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns a list of biomes.
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getBiomes
   * @memberof Filter
   * @inner
   */
  this.getBiomes = function(callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        // Creation of the query
        var query = "select " + memberTablesConfig.Biomes.IdFieldName + " as id, " + memberTablesConfig.Biomes.NameFieldName + " as name from " + memberTablesConfig.Biomes.Schema + "." + memberTablesConfig.Biomes.TableName + " order by " + memberTablesConfig.Biomes.NameFieldName + " asc;";

        // Execution of the query
        client.query(query, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns a list of states filtered by the received countries ids.
   * @param {array} countries - Countries ids
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getStatesByCountries
   * @memberof Filter
   * @inner
   */
  this.getStatesByCountries = function(countries, callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var parameter = 1;
        var params = [];

        // Creation of the query
        var query = "select " + memberTablesConfig.States.IdFieldName + " as id, " + memberTablesConfig.States.NameFieldName + " as name from " +
        memberTablesConfig.States.Schema + "." + memberTablesConfig.States.TableName +
        " where " + memberTablesConfig.States.CountryIdFieldName + " in (";

        for(var i = 0, countriesLength = countries.length; i < countriesLength; i++) {
          query += "$" + (parameter++) + ",";
          params.push(countries[i]);
        }

        query = query.substring(0, (query.length - 1)) + ") order by " + memberTablesConfig.States.CountryIdFieldName + " asc, " + memberTablesConfig.States.NameFieldName + " asc;";

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the countries extent correspondent to the received ids.
   * @param {array} countries - Countries ids
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getCountriesExtent
   * @memberof Filter
   * @inner
   */
  this.getCountriesExtent = function(countries, callback) {
    if(countries.length === 1 && memberFilterConfig.Extents.Countries[countries[0]] !== undefined) {
      var confExtent = memberFilterConfig.Extents.Countries[countries[0]].split(',');
      return callback(null, { rowCount: 1, rows: [{ extent: "BOX(" + confExtent[0] + " " + confExtent[1] + "," + confExtent[2] + " " + confExtent[3] + ")" }] });
    }

    var countriesWithExtent = [];
    var countriesWithoutExtent = [];

    for(var i = 0, countriesLength = countries.length; i < countriesLength; i++) {
      if(memberFilterConfig.Extents.Countries[countries[i]] !== undefined)
        countriesWithExtent.push(countries[i]);
      else
        countriesWithoutExtent.push(countries[i]);
    }

    var unionGeoms = "";

    if(countriesWithExtent.length > 0) {
      for(var i = 0, countriesWithExtentLength = countriesWithExtent.length; i < countriesWithExtentLength; i++)
        unionGeoms += "ST_MakeEnvelope(" + memberFilterConfig.Extents.Countries[countriesWithExtent[i]] + ", 4326), ";

      unionGeoms = unionGeoms.substring(0, (unionGeoms.length - 2));
    }

    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var parameter = 1;
        var params = [];

        // Creation of the query
        if(countriesWithoutExtent.length > 0) {
          var query = "select ST_Expand(ST_Extent(";

          if(unionGeoms !== "")
            query += "ST_Collect(ARRAY[" + memberTablesConfig.Countries.GeometryFieldName + ", " + unionGeoms + "])";
          else
            query += memberTablesConfig.Countries.GeometryFieldName;

          query += "), 2) as extent from " + memberTablesConfig.Countries.Schema + "." + memberTablesConfig.Countries.TableName + " where " + memberTablesConfig.Countries.IdFieldName + " in (";

          for(var i = 0, countriesWithoutExtentLength = countriesWithoutExtent.length; i < countriesWithoutExtentLength; i++) {
            query += "$" + (parameter++) + ",";
            params.push(countriesWithoutExtent[i]);
          }

          query = query.substring(0, (query.length - 1)) + ")";
        } else
          var query = "select ST_Expand(ST_Extent(ST_Collect(ARRAY[" + unionGeoms + "])), 2) as extent";

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the states extent correspondent to the received ids.
   * @param {array} states - States ids
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getStatesExtent
   * @memberof Filter
   * @inner
   */
  this.getStatesExtent = function(states, callback) {
    if(states.length === 1 && memberFilterConfig.Extents.States[states[0]] !== undefined) {
      var confExtent = memberFilterConfig.Extents.States[states[0]].split(',');
      return callback(null, { rowCount: 1, rows: [{ extent: "BOX(" + confExtent[0] + " " + confExtent[1] + "," + confExtent[2] + " " + confExtent[3] + ")" }] });
    }

    var statesWithExtent = [];
    var statesWithoutExtent = [];

    for(var i = 0, statesLength = states.length; i < statesLength; i++) {
      if(memberFilterConfig.Extents.States[states[i]] !== undefined)
        statesWithExtent.push(states[i]);
      else
        statesWithoutExtent.push(states[i]);
    }

    var unionGeoms = "";

    if(statesWithExtent.length > 0) {
      for(var i = 0, statesWithExtentLength = statesWithExtent.length; i < statesWithExtentLength; i++)
        unionGeoms += "ST_MakeEnvelope(" + memberFilterConfig.Extents.States[statesWithExtent[i]] + ", 4326), ";

      unionGeoms = unionGeoms.substring(0, (unionGeoms.length - 2));
    }

    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var parameter = 1;
        var params = [];

        // Creation of the query
        if(statesWithoutExtent.length > 0) {
          var query = "select ST_Expand(ST_Extent(";

          if(unionGeoms !== "")
            query += "ST_Collect(ARRAY[" + memberTablesConfig.States.GeometryFieldName + ", " + unionGeoms + "])";
          else
            query += memberTablesConfig.States.GeometryFieldName;

          query += "), 0.5) as extent from " + memberTablesConfig.States.Schema + "." + memberTablesConfig.States.TableName + " where " + memberTablesConfig.States.IdFieldName + " in (";

          for(var i = 0, statesWithoutExtentLength = statesWithoutExtent.length; i < statesWithoutExtentLength; i++) {
            query += "$" + (parameter++) + ",";
            params.push(statesWithoutExtent[i]);
          }

          query = query.substring(0, (query.length - 1)) + ")";
        } else
          var query = "select ST_Expand(ST_Extent(ST_Collect(ARRAY[" + unionGeoms + "])), 2) as extent";

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the extent of the protected area corresponding to the received id.
   * @param {integer} id - Id of the protected area
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getProtectedAreaExtent
   * @memberof Filter
   * @inner
   */
  this.getProtectedAreaExtent = function(id, callback) {
    if(memberFilterConfig.Extents.ProtectedAreas[id.toString()] !== undefined) {
      var confExtent = memberFilterConfig.Extents.ProtectedAreas[id.toString()].split(',');
      return callback(null, { rowCount: 1, rows: [{ extent: "BOX(" + confExtent[0] + " " + confExtent[1] + "," + confExtent[2] + " " + confExtent[3] + ")" }] });
    }

    var parameters = [id.toString()];

    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var schemaAndTable = memberTablesConfig.UCF.Schema + "." + memberTablesConfig.UCF.TableName;
        var geom = memberTablesConfig.UCF.GeometryFieldName;
        var idField = memberTablesConfig.UCF.IdFieldName;

        // Creation of the query
        var query = "select ST_Expand(ST_Extent(" + geom + "), 0.5) as extent from " + schemaAndTable + " where " + idField + " = $1;";

        // Execution of the query
        client.query(query, parameters, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the extent of the city corresponding to the received id.
   * @param {string} id - Id of the city
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getCityExtent
   * @memberof Filter
   * @inner
   */
  this.getCityExtent = function(id, callback) {
    if(memberFilterConfig.Extents.Cities[id] !== undefined) {
      var confExtent = memberFilterConfig.Extents.Cities[id].split(',');
      return callback(null, { rowCount: 1, rows: [{ extent: "BOX(" + confExtent[0] + " " + confExtent[1] + "," + confExtent[2] + " " + confExtent[3] + ")" }] });
    }

    var parameters = [id];

    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        // Creation of the query
        var query = "select ST_Expand(ST_Extent(" + memberTablesConfig.Cities.GeometryFieldName + "), 0.1) as extent from " + memberTablesConfig.Cities.Schema + "." + memberTablesConfig.Cities.TableName + " where " + memberTablesConfig.Cities.IdFieldName + " = $1;";

        // Execution of the query
        client.query(query, parameters, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the data of the polygon that intersects with the received point.
   * @param {string} longitude - Longitude of the point
   * @param {string} latitude - Latitude of the point
   * @param {float} resolution - Current map resolution
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getDataByIntersection
   * @memberof Filter
   * @inner
   */
  this.getDataByIntersection = function(longitude, latitude, resolution, callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {

        var key = "States";

        if(resolution >= memberFilterConfig.SpatialFilter.Countries.MinResolution && resolution < memberFilterConfig.SpatialFilter.Countries.MaxResolution)
          key = "Countries";

        // Creation of the query
        var query = "SELECT " + memberTablesConfig[key].IdFieldName + " as id, " + memberTablesConfig[key].NameFieldName + " as name, '" + key + "' as key, " + memberTablesConfig[key].BdqNameFieldName + " as bdq_name" +
        " FROM " + memberTablesConfig[key].Schema + "." + memberTablesConfig[key].TableName + " WHERE ST_Intersects(" + memberTablesConfig[key].GeometryFieldName + ", ST_SetSRID(ST_MakePoint($1, $2), 4326));";

        var params = [longitude, latitude];

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the satellites for the given filter.
   * @param {string} dateTimeFrom - Initial date / time
   * @param {string} dateTimeTo - Final date / time
   * @param {json} options - Filtering options
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function getSatellites
   * @memberof Filter
   * @inner
   */
  this.getSatellites = function(dateTimeFrom, dateTimeTo, options, callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        // Counter of the query parameters
        var parameter = 1;

        // Creation of the query
        var query = "select distinct " + memberTablesConfig.Fires.SatelliteFieldName + " from " + memberTablesConfig.Fires.Schema + "." + memberTablesConfig.Fires.TableName +
            " where (" + memberTablesConfig.Fires.DateTimeFieldName + " between $" + (parameter++) + " and $" + (parameter++) + ")",
            params = [dateTimeFrom, dateTimeTo];

        var getFiltersResult = memberUtils.getFilters(options, query, params, parameter);

        query = getFiltersResult.query;
        params = getFiltersResult.params;
        parameter = getFiltersResult.parameter;

        // Execution of the query
        client.query(query, params, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the protected areas that match the given value.
   * @param {string} value - Value to be used in the search of protected areas
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function searchForPAs
   * @memberof Filter
   * @inner
   */
  this.searchForPAs = function(value, callback) {
    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var parameters = ['%' + value + '%'];
        var query = "select " + memberTablesConfig.UCF.IdFieldName + " as id, upper(" + memberTablesConfig.UCF.NameFieldName + ") as name " +
        "from " + memberTablesConfig.UCF.Schema + "." + memberTablesConfig.UCF.TableName +
        " where unaccent(upper(" + memberTablesConfig.UCF.NameFieldName + ")) like unaccent(upper($1))";

        // Execution of the query
        client.query(query, parameters, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };

  /**
   * Returns the cities that match the given value.
   * @param {string} value - Value to be used in the search of cities
   * @param {function} callback - Callback function
   * @returns {function} callback - Execution of the callback function, which will process the received data
   *
   * @function searchForCities
   * @memberof Filter
   * @inner
   */
  this.searchForCities = function(value, countries, states, callback) {
    // Counter of the query parameters
    var parameter = 1;

    // Connection with the PostgreSQL database
    memberPgPool.connect(function(err, client, done) {
      if(!err) {
        var query = "select a." + memberTablesConfig.Cities.IdFieldName + " as id, upper(a." + memberTablesConfig.Cities.NameFieldName +
                    ") as name, b." + memberTablesConfig.States.BdqNameFieldName + " as state " +
                    "from " + memberTablesConfig.Cities.Schema + "." + memberTablesConfig.Cities.TableName + " a " +
                    "inner join " + memberTablesConfig.States.Schema + "." + memberTablesConfig.States.TableName + 
                    " b on (a." + memberTablesConfig.Cities.StateIdFieldName + "=b." + memberTablesConfig.States.IdFieldName + ") " +
                    "inner join " + memberTablesConfig.Countries.Schema + "." + memberTablesConfig.Countries.TableName + 
                    " c on (b." + memberTablesConfig.States.CountryIdFieldName + "=c." + memberTablesConfig.Countries.IdFieldName + ") " +
                    " where unaccent(upper(a." + memberTablesConfig.Cities.NameFieldName + ")) like unaccent(upper($" + (parameter++) + "))";
        var parameters = ['%' + value + '%'];

        if(countries !== null) {
          var countriesArray = countries.split(',');
          query += " and c." + memberTablesConfig.Countries.IdFieldName + " in (";

          for(var i = 0, countriesArrayLength = countriesArray.length; i < countriesArrayLength; i++) {
            query += "$" + (parameter++) + ",";
            parameters.push(countriesArray[i]);
          }

          query = query.substring(0, (query.length - 1)) + ")";
        }

        if(states !== null) {
          var statesArray = states.split(',');
          query += " and b." + memberTablesConfig.States.IdFieldName + " in (";

          for(var i = 0, statesArrayLength = statesArray.length; i < statesArrayLength; i++) {
            query += "$" + (parameter++) + ",";
            parameters.push(statesArray[i]);
          }

          query = query.substring(0, (query.length - 1)) + ")";
        }

        // Execution of the query
        client.query(query, parameters, function(err, result) {
          done();
          if(!err) return callback(null, result);
          else return callback(err);
        });
      } else return callback(err);
    });
  };
};

module.exports = Filter;
