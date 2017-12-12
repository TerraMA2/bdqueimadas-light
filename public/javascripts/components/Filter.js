"use strict";

/**
 * Filter class of the BDQueimadas.
 * @class Filter
 * @variation 2
 *
 * @author Jean Souza [jean.souza@funcate.org.br]
 *
 * @property {date} memberDateFrom - Current initial date.
 * @property {date} memberDateTo - Current final date.
 * @property {string} memberTimeFrom - Current initial time.
 * @property {string} memberTimeTo - Current final time.
 * @property {array} memberSatellites - Current satellites.
 * @property {array} memberBiomes - Current biomes.
 * @property {array} memberCountries - Current countries.
 * @property {array} memberStates - Current states.
 * @property {string} memberCity - Current city.
 * @property {boolean} memberInitialFilter - Flag that indicates if the current filter is the initial one.
 * @property {array} memberInitialSatellites - Initial satellites.
 * @property {object} memberLastFilters - Last filters used in the layers.
 */
define(
  ['components/Utils', 'components/Map', 'TerraMA2WebComponents'],
  function(Utils, Map, TerraMA2WebComponents) {

    // Current initial date
    var memberDateFrom = null;
    // Current final date
    var memberDateTo = null;
    // Current initial time
    var memberTimeFrom = null;
    // Current final time
    var memberTimeTo = null;
    // Current satellites
    var memberSatellites = ["all"];
    // Current biomes
    var memberBiomes = ["all"];
    // Current countries
    var memberCountries = [];
    // Current states
    var memberStates = [];
    // Current city
    var memberCity = null;
    // Flag that indicates if the current filter is the initial one
    var memberInitialFilter = true;
    // Initial satellites
    var memberInitialSatellites = null;
    // Last filters used in the layers
    var memberLastFilters = {};

    /**
     * Returns the initial date formatted with the received format.
     * @param {string} format - Format
     * @returns {string} Utils.dateToString() - Formatted initial date (string)
     *
     * @function getFormattedDateFrom
     * @memberof Filter(2)
     * @inner
     */
    var getFormattedDateFrom = function(format) {
      return Utils.dateToString(memberDateFrom, format);
    };

    /**
     * Returns the final date formatted with the received format.
     * @param {string} format - Format
     * @returns {string} Utils.dateToString() - Formatted final date (string)
     *
     * @function getFormattedDateTo
     * @memberof Filter(2)
     * @inner
     */
    var getFormattedDateTo = function(format) {
      return Utils.dateToString(memberDateTo, format);
    };

    /**
     * Returns the initial time.
     * @returns {string} memberTimeFrom - Initial time
     *
     * @function getTimeFrom
     * @memberof Filter(2)
     * @inner
     */
    var getTimeFrom = function() {
      return memberTimeFrom;
    };

    /**
     * Returns the final time.
     * @returns {string} memberTimeTo - Final time
     *
     * @function getTimeTo
     * @memberof Filter(2)
     * @inner
     */
    var getTimeTo = function() {
      return memberTimeTo;
    };

    /**
     * Sets the satellites array.
     * @param {array} satellites - Satellites array
     *
     * @function setSatellites
     * @memberof Filter(2)
     * @inner
     */
    var setSatellites = function(satellites) {
      memberSatellites = satellites;
    };

    /**
     * Returns the satellites array.
     * @returns {array} memberSatellites - Satellites array
     *
     * @function getSatellites
     * @memberof Filter(2)
     * @inner
     */
    var getSatellites = function() {
      return memberSatellites;
    };

    /**
     * Sets the biomes array.
     * @param {array} biomes - Biomes array
     *
     * @function setBiomes
     * @memberof Filter(2)
     * @inner
     */
    var setBiomes = function(biomes) {
      memberBiomes = biomes;
    };

    /**
     * Returns the biomes array.
     * @returns {array} memberBiomes - Biomes array
     *
     * @function getBiomes
     * @memberof Filter(2)
     * @inner
     */
    var getBiomes = function() {
      return memberBiomes;
    };

    /**
     * Sets the countries array.
     * @param {array} countries - Countries array
     *
     * @function setCountries
     * @memberof Filter(2)
     * @inner
     */
    var setCountries = function(countries) {
      memberCountries = countries;
    };

    /**
     * Returns the countries array.
     * @returns {array} memberCountries - Countries array
     *
     * @function getCountries
     * @memberof Filter(2)
     * @inner
     */
    var getCountries = function() {
      return memberCountries;
    };

    /**
     * Clears the list of selected countries.
     *
     * @function clearCountries
     * @memberof Filter(2)
     * @inner
     */
    var clearCountries = function() {
      setCountries([]);
      $("#countries option:selected").removeAttr("selected");
    };

    /**
     * Sets the states array.
     * @param {array} states - States array
     *
     * @function setStates
     * @memberof Filter(2)
     * @inner
     */
    var setStates = function(states) {
      memberStates = states;
    };

    /**
     * Returns the states array.
     * @returns {array} memberStates - States array
     *
     * @function getStates
     * @memberof Filter(2)
     * @inner
     */
    var getStates = function() {
      return memberStates;
    };

    /**
     * Sets the city.
     * @param {string} city - City
     *
     * @function setCity
     * @memberof Filter(2)
     * @inner
     */
    var setCity = function(city) {
      memberCity = city;
    };

    /**
     * Returns the city.
     * @returns {string} memberCity - City
     *
     * @function getCity
     * @memberof Filter(2)
     * @inner
     */
    var getCity = function() {
      return memberCity;
    };

    /**
     * Clears the list of selected states.
     *
     * @function clearStates
     * @memberof Filter(2)
     * @inner
     */
    var clearStates = function() {
      setStates([]);
      $("#states option:selected[value!='0']").removeAttr("selected");
    };

    /**
     * Returns the initial filter flag.
     * @returns {boolean} memberInitialFilter - Flag that indicates if the current filter is the initial one
     *
     * @function isInitialFilter
     * @memberof Filter(2)
     * @inner
     */
    var isInitialFilter = function() {
      return memberInitialFilter;
    };

    /**
     * Sets the initial filter flag to false.
     *
     * @function setInitialFilterToFalse
     * @memberof Filter(2)
     * @inner
     */
    var setInitialFilterToFalse = function() {
      memberInitialFilter = false;
    };

    /**
     * Returns the array of initial satellites.
     * @returns {array} memberInitialSatellites - Initial satellites
     *
     * @function getInitialSatellites
     * @memberof Filter(2)
     * @inner
     */
    var getInitialSatellites = function() {
      return memberInitialSatellites;
    };

    /**
     * Creates the date / time filter.
     * @returns {string} cql - Date / time cql filter
     *
     * @private
     * @function createDateTimeFilter
     * @memberof Filter(2)
     * @inner
     */
    var createDateTimeFilter = function() {
      var cql = Utils.getConfigurations().filterConfigurations.LayerToFilter.DateTimeFieldName + " between " + Utils.dateToString(memberDateFrom, Utils.getConfigurations().filterConfigurations.LayerToFilter.DateFormat) + 'T' + memberTimeFrom;
      cql += " and ";
      cql += Utils.dateToString(memberDateTo, Utils.getConfigurations().filterConfigurations.LayerToFilter.DateFormat) + 'T' + memberTimeTo;

      return cql;
    };

    /**
     * Updates the initial and the final date.
     * @param {string} newDateFrom - New initial date (string)
     * @param {string} newDateTo - New final date (string)
     * @param {string} format - Dates format
     *
     * @function updateDates
     * @memberof Filter(2)
     * @inner
     */
    var updateDates = function(newDateFrom, newDateTo, format) {
      memberDateFrom = Utils.stringToDate(newDateFrom, format);
      memberDateTo = Utils.stringToDate(newDateTo, format);

      memberDateFrom.setHours(0,0,0,0);
      memberDateTo.setHours(0,0,0,0);

      $('#filter-date-from').val(Utils.dateToString(memberDateFrom, 'YYYY/MM/DD'));
      $('#filter-date-to').val(Utils.dateToString(memberDateTo, 'YYYY/MM/DD'));
    };

    /**
     * Updates the initial and the final times.
     * @param {string} newTimeFrom - New initial time
     * @param {string} newTimeTo - New final time
     *
     * @function updateTimes
     * @memberof Filter(2)
     * @inner
     */
    var updateTimes = function(newTimeFrom, newTimeTo) {
      memberTimeFrom = newTimeFrom;
      memberTimeTo = newTimeTo;

      $('#filter-time-from').val(memberTimeFrom);
      $('#filter-time-to').val(memberTimeTo);
    };

    /**
     * Updates the initial and the final date to the current date.
     *
     * @function updateDatesToCurrent
     * @memberof Filter(2)
     * @inner
     */
    var updateDatesToCurrent = function() {
      memberDateFrom = Utils.getCurrentDate(true);
      memberDateTo = Utils.getCurrentDate(true);
      memberDateFrom.setHours(memberDateFrom.getHours() - 24);

      memberDateFrom.setHours(0,0,0,0);
      memberDateTo.setHours(0,0,0,0);

      $('#filter-date-from').val(Utils.dateToString(memberDateFrom, 'YYYY/MM/DD'));
      $('#filter-date-to').val(Utils.dateToString(memberDateTo, 'YYYY/MM/DD'));

      $('#filter-date-from-attributes-table').val(Utils.dateToString(memberDateFrom, 'YYYY/MM/DD'));
      $('#filter-date-to-attributes-table').val(Utils.dateToString(memberDateTo, 'YYYY/MM/DD'));

      $('#filter-date-from-graphics').val(Utils.dateToString(memberDateFrom, 'YYYY/MM/DD'));
      $('#filter-date-to-graphics').val(Utils.dateToString(memberDateTo, 'YYYY/MM/DD'));
    };

    /**
     * Updates the initial and the final times to the default times.
     *
     * @function updateTimesToDefault
     * @memberof Filter(2)
     * @inner
     */
    var updateTimesToDefault = function() {
      memberTimeFrom = '00:00';
      memberTimeTo = '23:59';

      $('#filter-time-from').val(memberTimeFrom);
      $('#filter-time-to').val(memberTimeTo);

      $('#filter-time-from-attributes-table').val(memberTimeFrom);
      $('#filter-time-to-attributes-table').val(memberTimeTo);

      $('#filter-time-from-graphics').val(memberTimeFrom);
      $('#filter-time-to-graphics').val(memberTimeTo);
    };

    /**
     * Creates the satellites filter.
     * @returns {string} cql - Satellites cql filter
     *
     * @private
     * @function createSatellitesFilter
     * @memberof Filter(2)
     * @inner
     */
    var createSatellitesFilter = function() {
      var cql = Utils.getConfigurations().filterConfigurations.LayerToFilter.SatelliteFieldName + " in (";

      if(memberInitialFilter) {
        var memberSatellitesLength = memberInitialSatellites.length;

        for(var i = 0; i < memberSatellitesLength; i++) {
          cql += "'" + memberInitialSatellites[i] + "',";
        }
      } else {
        var memberSatellitesLength = memberSatellites.length;

        for(var i = 0; i < memberSatellitesLength; i++) {
          cql += "'" + memberSatellites[i] + "',";
        }
      }

      cql = cql.substring(0, cql.length - 1) + ")";

      return cql;
    };

    /**
     * Creates the biomes filter.
     * @returns {string} cql - Biomes cql filter
     *
     * @private
     * @function createBiomesFilter
     * @memberof Filter(2)
     * @inner
     */
    var createBiomesFilter = function() {
      var cql = "(" + Utils.getConfigurations().filterConfigurations.LayerToFilter.BiomeFieldName + " in (";

      var memberBiomesLength = memberBiomes.length;

      for(var i = 0; i < memberBiomesLength; i++) {
        cql += "'" + memberBiomes[i] + "',";
      }

      cql = cql.substring(0, cql.length - 1) + "))";

      return cql;
    };

    /**
     * Creates the countries filter.
     * @returns {string} cql - Countries cql filter
     *
     * @private
     * @function createCountriesFilter
     * @memberof Filter(2)
     * @inner
     */
    var createCountriesFilter = function() {
      var cql = "(" + Utils.getConfigurations().filterConfigurations.LayerToFilter.CountryFieldName + " in (";

      for(var i = 0, memberCountriesLength = memberCountries.length; i < memberCountriesLength; i++) {
        cql += memberCountries[i] + ",";
      }

      cql = cql.substring(0, cql.length - 1) + "))";

      return cql;
    };

    /**
     * Creates the states filter.
     * @returns {string} cql - States cql filter
     *
     * @private
     * @function createStatesFilter
     * @memberof Filter(2)
     * @inner
     */
    var createStatesFilter = function() {
      var cql = "(";

      if(memberStates.length > 0) {
        cql += Utils.getConfigurations().filterConfigurations.LayerToFilter.StateFieldName + " in (";

        for(var i = 0, memberStatesLength = memberStates.length; i < memberStatesLength; i++) {
          cql += "'" + memberStates[i] + "',";
        }

        cql = cql.substring(0, cql.length - 1) + ")";
      }

      cql += ")";

      return cql;
    };

    /**
     * Creates the cities filter.
     * @returns {string} cql - States cql filter
     *
     * @private
     * @function createCitiesFilter
     * @memberof Filter(2)
     * @inner
     */
    var createCitiesFilter = function() {
      var cql = "(" + Utils.getConfigurations().filterConfigurations.LayerToFilter.CityFieldName + "='" + memberCity + "')";

      return cql;
    };

    /**
     * Applies the dates, the satellites and the biomes filters.
     *
     * @function applyFilter
     * @memberof Filter(2)
     * @inner
     */
    var applyFilter = function() {
      var dates = Utils.getFilterDates(true, true, true, 0);
      var times = Utils.getFilterTimes(true, 0);

      if(dates !== null && times !== null) {
        if(dates.length === 0) {
          updateDatesToCurrent();
          var filterDateFrom = getFormattedDateFrom('YYYY/MM/DD');
          var filterDateTo = getFormattedDateTo('YYYY/MM/DD');
        } else {
          var filterDateFrom = dates[0];
          var filterDateTo = dates[1];
        }

        if(times.length === 0) {
          updateTimesToDefault();
          var filterTimeFrom = '00:00';
          var filterTimeTo = '23:59';
        } else {
          var filterTimeFrom = times[0];
          var filterTimeTo = times[1];
        }

        $('#filter-date-from-attributes-table').val(filterDateFrom);
        $('#filter-date-to-attributes-table').val(filterDateTo);

        $('#filter-date-from-graphics').val(filterDateFrom);
        $('#filter-date-to-graphics').val(filterDateTo);

        $('#filter-time-from-attributes-table').val(filterTimeFrom);
        $('#filter-time-to-attributes-table').val(filterTimeTo);

        $('#filter-time-from-graphics').val(filterTimeFrom);
        $('#filter-time-to-graphics').val(filterTimeTo);

        setSatellites($('#filter-satellite').val());

        $('#filter-satellite-attributes-table').val($('#filter-satellite').val());
        $('#filter-satellite-graphics').val($('#filter-satellite').val());

        setBiomes($('#filter-biome').val());

        $('#filter-biome-attributes-table').val($('#filter-biome').val());
        $('#filter-biome-graphics').val($('#filter-biome').val());

        var cql = "";

        if(filterDateFrom.length > 0 && filterDateTo.length > 0 && filterTimeFrom.length > 0 && filterTimeTo.length > 0) {
          var updateLayersTime = ((getFormattedDateFrom("YYYY/MM/DD") != filterDateFrom) || (getFormattedDateTo("YYYY/MM/DD") != filterDateTo));

          updateDates(filterDateFrom, filterDateTo, 'YYYY/MM/DD');
          updateTimes(filterTimeFrom, filterTimeTo);

          cql += createDateTimeFilter() + " AND ";

          if(Map.getLayers().length > 0) processLayers(Map.getLayers(), updateLayersTime);
        }

        if(!Utils.stringInArray(memberSatellites, "all") || memberInitialFilter) {
          cql += createSatellitesFilter() + " AND ";
        }

        if(!Utils.stringInArray(memberBiomes, "all")) {
          cql += createBiomesFilter() + " AND ";
        }

        if(!Utils.stringInArray(memberCountries, "") && memberCountries.length > 0) {
          cql += createCountriesFilter() + " AND ";
        }

        if(!Utils.stringInArray(memberStates, "") && memberStates.length > 0) {
          cql += createStatesFilter() + " AND ";
        }

        if(memberCity !== null) {
          cql += createCitiesFilter() + " AND ";
        }

        if(cql.length > 5) {
          cql = cql.substring(0, cql.length - 5);
        }

        updateSatellitesSelect(0);
        applyCqlFilterToLayer(cql, Utils.getConfigurations().filterConfigurations.LayerToFilter.LayerId);
      }

      if(!$('#loading-span').hasClass('hide')) $('#loading-span').addClass('hide');
    };

    /**
     * Applies a cql filter to the layer with the given id.
     * @param {string} cqlFilter - Cql filter
     * @param {string} layerId - Layer id
     *
     * @function applyCqlFilterToLayer
     * @memberof Filter(2)
     * @inner
     */
    var applyCqlFilterToLayer = function(cqlFilter, layerId) {
      if(memberInitialFilter || cqlFilter != memberLastFilters[layerId]) {
        TerraMA2WebComponents.MapDisplay.applyCQLFilter(cqlFilter, layerId);
        memberLastFilters[layerId] = cqlFilter;
      }
    };

    /**
     * Processes a list of layers and applies filters to the layers that should be filtered.
     * @param {array} layers - Layers array
     * @param {boolean} updateLayersTime - Flag that indicates if the time of the layers should be updated
     *
     * @private
     * @function processLayers
     * @memberof Filter(2)
     * @inner
     */
    var processLayers = function(layers, updateLayersTime) {
      for(var i = 0, layersLength = layers.length; i < layersLength; i++) {
        if(layers[i].Params.Time !== undefined && layers[i].Params.Time !== null && (memberInitialFilter || updateLayersTime)) Map.updateLayerTime(layers[i]);

        if(layers[i].Id === Utils.getConfigurations().filterConfigurations.StatesLayer.Id) {
          var cqlFilter = Utils.getConfigurations().filterConfigurations.StatesLayer.CountryField + " in (";

          var memberCountriesLength = memberCountries.length;

          if(memberCountriesLength > 0) {
            for(var count = 0; count < memberCountriesLength; count++) cqlFilter += memberCountries[count] + ",";

            cqlFilter = cqlFilter.substring(0, (cqlFilter.length - 1)) + ")";
          } else {
            cqlFilter += "0)";
          }

          applyCqlFilterToLayer(cqlFilter, layers[i].Id);
        } else if(layers[i].Id === Utils.getConfigurations().filterConfigurations.CitiesLayer.Id) {
          var cqlFilter = Utils.getConfigurations().filterConfigurations.CitiesLayer.CountryField + " in (";
          var cqlFilterOneCity = Utils.getConfigurations().filterConfigurations.CitiesLayer.CityField + "='";

          if($('#states').val() !== null) {
            var states = $('#states').val();
            var index = states.indexOf("0");
          } else {
            var index = -1;
          }

          if(index > -1) {
            var memberCountriesLength = memberCountries.length;

            if(memberCountriesLength > 0) {
              for(var count = 0; count < memberCountriesLength; count++) cqlFilter += memberCountries[count] + ",";
              cqlFilter = cqlFilter.substring(0, (cqlFilter.length - 1)) + ")";
            } else {
              if($('#city').data('value') !== undefined && $('#city').data('value') !== null) {
                cqlFilterOneCity += $('#city').data('value') + "'";
                cqlFilter = cqlFilterOneCity;
              } else
                cqlFilter += "0)";
            }
          } else {
            var memberStatesLength = memberStates.length;

            if(memberStatesLength > 0) {
              var statesCqlFilter = Utils.getConfigurations().filterConfigurations.CitiesLayer.StateField + " in (";
              var citiesCqlFilter = Utils.getConfigurations().filterConfigurations.CitiesLayer.CityField + " in (";

              var filterStates = false;
              var filterCities = false;

              if(memberStatesLength > 0) {
                for(var count = 0; count < memberStatesLength; count++) {
                  var ids = Utils.getStateIds(memberStates[count]);
                  cqlFilter += ids[0] + ",";
                  statesCqlFilter += "'" + memberStates[count] + "',";
                }

                if(!filterStates) filterStates = true;
              }

              if(filterStates)
                cqlFilter = cqlFilter.substring(0, (cqlFilter.length - 1)) + ") AND " + statesCqlFilter.substring(0, (statesCqlFilter.length - 1)) + ")";

              if(filterStates && filterCities)
                cqlFilter = cqlFilter + " OR " + citiesCqlFilter.substring(0, (citiesCqlFilter.length - 1)) + ")";
              else if(filterCities)
                cqlFilter = citiesCqlFilter.substring(0, (citiesCqlFilter.length - 1)) + ")";
            } else {
              if($('#city').data('value') !== undefined && $('#city').data('value') !== null) {
                cqlFilterOneCity += $('#city').data('value') + "'";
                cqlFilter = cqlFilterOneCity;
              } else
                cqlFilter += "0)";
            }
          }

          applyCqlFilterToLayer(cqlFilter, layers[i].Id);
        }
      }
    };

    /**
     * Updates the satellites HTML select.
     * @param {integer} filter - Number that indicates which filter fields should be used: 0 - main filter, 1 - attributes table filter, 2 - graphics filter
     * @param {date} filterDateFrom - Filter date from
     * @param {date} filterDateTo - Filter date to
     *
     * @function updateSatellitesSelect
     * @memberof Filter(2)
     * @inner
     */
    var updateSatellitesSelect = function(filter, filterDateFrom, filterDateTo) {
      var filterFieldsExtention = '';

      if(filter === 1) {
        filterFieldsExtention = '-attributes-table';
      } else if(filter === 2) {
        filterFieldsExtention = '-graphics';
      } else if(filter === 3) {
        filterFieldsExtention = '-export';
      }

      var dateFrom = memberDateFrom;
      var dateTo = memberDateTo;

      if(filterDateFrom !== undefined && filterDateTo !== undefined) {
        dateFrom = filterDateFrom;
        dateTo = filterDateTo;
      }

      var selectedOptions = (filterFieldsExtention !== '' ? $('#filter-satellite' + filterFieldsExtention).val() : $('#filter-satellite').val());

      var allOption = Utils.stringInArray(selectedOptions, "all") ? "<option value=\"all\" selected>TODOS</option>" : "<option value=\"all\">TODOS</option>";
      var referenceSatellite = "";
      var elem = "";
      var satellitesList = Utils.getConfigurations().filterConfigurations.Satellites;

      for(var i = 0, satellitesListLength = satellitesList.length; i < satellitesListLength; i++) {
        var satelliteBegin = Utils.getCurrentDate(true);
        var satelliteEnd = Utils.getCurrentDate(true);

        var satelliteReferenceBegin = Utils.getCurrentDate(true);
        var satelliteReferenceEnd = Utils.getCurrentDate(true);

        if(satellitesList[i].Begin !== "") {
          var satelliteBeginArray = satellitesList[i].Begin.split('-');
          satelliteBegin = new Date(parseInt(satelliteBeginArray[0]), parseInt(satelliteBeginArray[1]) - 1, parseInt(satelliteBeginArray[2]), 0, 0, 0);
        }

        if(satellitesList[i].End !== "") {
          var satelliteEndArray = satellitesList[i].End.split('-');
          satelliteEnd = new Date(parseInt(satelliteEndArray[0]), parseInt(satelliteEndArray[1]) - 1, parseInt(satelliteEndArray[2]), 0, 0, 0);
        }

        if(satellitesList[i].ReferenceBegin !== "") {
          var satelliteReferenceBeginArray = satellitesList[i].ReferenceBegin.split('-');
          satelliteReferenceBegin = new Date(parseInt(satelliteReferenceBeginArray[0]), parseInt(satelliteReferenceBeginArray[1]) - 1, parseInt(satelliteReferenceBeginArray[2]), 0, 0, 0);
        }

        if(satellitesList[i].ReferenceEnd !== "") {
          var satelliteReferenceEndArray = satellitesList[i].ReferenceEnd.split('-');
          satelliteReferenceEnd = new Date(parseInt(satelliteReferenceEndArray[0]), parseInt(satelliteReferenceEndArray[1]) - 1, parseInt(satelliteReferenceEndArray[2]), 0, 0, 0);
        }

        if((dateFrom <= satelliteBegin && dateTo >= satelliteEnd) || 
          (dateFrom >= satelliteBegin && dateTo <= satelliteEnd) || 
          (dateFrom <= satelliteBegin && dateTo >= satelliteBegin) || 
          (dateFrom <= satelliteEnd && dateTo >= satelliteEnd)) {

          if((dateFrom <= satelliteReferenceBegin && dateTo >= satelliteReferenceEnd) || 
            (dateFrom >= satelliteReferenceBegin && dateTo <= satelliteReferenceEnd) || 
            (dateFrom <= satelliteReferenceBegin && dateTo >= satelliteReferenceBegin) || 
            (dateFrom <= satelliteReferenceEnd && dateTo >= satelliteReferenceEnd)) {
            if(Utils.stringInArray(selectedOptions, satellitesList[i].Id)) {
              referenceSatellite += "<option value=\"" + satellitesList[i].Id + "\" selected>Refer. (" + satellitesList[i].Name + ")</option>";
            } else {
              referenceSatellite += "<option value=\"" + satellitesList[i].Id + "\">Refer. (" + satellitesList[i].Name + ")</option>";
            }
          } else {
            if(Utils.stringInArray(selectedOptions, satellitesList[i].Id)) {
              elem += "<option value=\"" + satellitesList[i].Id + "\" selected>" + satellitesList[i].Name + "</option>";
            } else {
              elem += "<option value=\"" + satellitesList[i].Id + "\">" + satellitesList[i].Name + "</option>";
            }
          }
        } else if(Utils.stringInArray(selectedOptions, satellitesList[i].Id)) {
          elem += "<option value=\"" + satellitesList[i].Id + "\" selected>" + satellitesList[i].Name + "</option>";
        }
      }

      if(filterFieldsExtention !== '')
        $('#filter-satellite' + filterFieldsExtention).empty().html(allOption + referenceSatellite + elem);
      else {
        $('#filter-satellite').empty().html(allOption + referenceSatellite + elem);

        if(filter === 0) {
          $('#filter-satellite-attributes-table').empty().html(allOption + referenceSatellite + elem);
          $('#filter-satellite-graphics').empty().html(allOption + referenceSatellite + elem);
        }
      }
    };

    /**
     * Selects a list of countries in the countries dropdown and fills the states dropdown.
     * @param {array} ids - Countries ids
     *
     * @function selectCountries
     * @memberof Filter(2)
     * @inner
     */
    var selectCountries = function(ids) {
      Utils.getSocket().emit('spatialFilterRequest', { ids: ids, key: 'Countries', filterForm: false });
    };

    /**
     * Selects a list of states in the states dropdown and selects a list of countries in the countries dropdown.
     * @param {array} ids - States ids
     *
     * @function selectStates
     * @memberof Filter(2)
     * @inner
     */
    var selectStates = function(ids) {
      Utils.getSocket().emit('countriesByStatesRequest', { states: ids });
      Utils.getSocket().emit('spatialFilterRequest', { ids: ids, key: 'States', filterForm: false });
    };

    /**
     * Enables a dropdown.
     * @param {string} id - Item HTML id
     * @param {string} itemId - Item id
     *
     * @function enableDropdown
     * @memberof Filter(2)
     * @inner
     */
    var enableDropdown = function(id, itemId) {
      $('#' + id).removeAttr('disabled');
      $('#' + id).val(itemId);
      $('#' + id).attr('data-value', itemId);
    };

    /**
     * Disables a dropdown.
     * @param {string} id - Item HTML id
     * @param {string} itemId - Item id
     *
     * @function disableDropdown
     * @memberof Filter(2)
     * @inner
     */
    var disableDropdown = function(id, itemId) {
      $('#' + id).empty();
      $('#' + id).val(itemId);
      $('#' + id).attr('data-value', itemId);
      $('#' + id).attr('disabled', 'disabled');
    };

    /**
     * Resets the three dropdowns to its initial states.
     *
     * @function resetDropdowns
     * @memberof Filter(2)
     * @inner
     */
    var resetDropdowns = function() {
      disableDropdown('countries', '');
      $('#countries').empty();
      disableDropdown('states', '');
      $('#states').empty();

      enableDropdown('countries-graphics', '');
      $('#countries-graphics').empty();
      disableDropdown('states-graphics', '');
      $('#states-graphics').empty();

      enableDropdown('countries-attributes-table', '');
      $('#countries-attributes-table').empty();
      disableDropdown('states-attributes-table', '');
      $('#states-attributes-table').empty();
    };

    /**
     * Converts a string BBOX to an array BBOX.
     * @param {string} stringBbox - String BBOX
     * @returns {array} extentArray - Array BBOX
     *
     * @function stringBbox2ArrayBbox
     * @memberof Filter(2)
     * @inner
     */
    var stringBbox2ArrayBbox = function(stringBbox) {
      var extent = stringBbox.replace('BOX(', '').replace(')', '').split(',');
      var extentArray = extent[0].split(' ');
      extentArray = extentArray.concat(extent[1].split(' '));

      return extentArray;
    };

    /**
     * Initializes the necessary features.
     *
     * @function init
     * @memberof Filter(2)
     * @inner
     */
    var init = function() {
      $(document).ready(function() {
        updateDatesToCurrent();
        updateTimesToDefault();

        memberInitialSatellites = initialSatellites;

        TerraMA2WebComponents.MapDisplay.zoomToExtent(Utils.getConfigurations().applicationConfigurations.ContinentExtent);

        $('#filter-satellite').val('all');
        $('#filter-satellite-graphics').val('all');
        $('#filter-satellite-attributes-table').val('all');
      });
    };

    return {
      getFormattedDateFrom: getFormattedDateFrom,
      getFormattedDateTo: getFormattedDateTo,
      getTimeFrom: getTimeFrom,
      getTimeTo: getTimeTo,
      setSatellites: setSatellites,
      getSatellites: getSatellites,
      setBiomes: setBiomes,
      getBiomes: getBiomes,
      setCountries: setCountries,
      getCountries: getCountries,
      clearCountries: clearCountries,
      setStates: setStates,
      getStates: getStates,
      setCity: setCity,
      getCity: getCity,
      clearStates: clearStates,
      isInitialFilter: isInitialFilter,
      setInitialFilterToFalse: setInitialFilterToFalse,
      getInitialSatellites: getInitialSatellites,
      updateDates: updateDates,
      updateTimes: updateTimes,
      updateDatesToCurrent: updateDatesToCurrent,
      updateTimesToDefault: updateTimesToDefault,
      applyFilter: applyFilter,
      applyCqlFilterToLayer: applyCqlFilterToLayer,
      updateSatellitesSelect: updateSatellitesSelect,
      selectCountries: selectCountries,
      selectStates: selectStates,
      enableDropdown: enableDropdown,
      disableDropdown: disableDropdown,
      resetDropdowns: resetDropdowns,
      stringBbox2ArrayBbox: stringBbox2ArrayBbox,
      init: init
    };
  }
);
