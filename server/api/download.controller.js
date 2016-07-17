'use strict';

var request = require('request');
var props = require('../properties');



exports.getBarChartData = function (req, res) {
  console.log("getBarChartData service");
var exampleData = [{
  key: "Cumulative Return",
  values: [
    { "label" : "A" , "value" : -29.765957771107 },
    { "label" : "B" , "value" : 0 },
    { "label" : "C" , "value" : 32.807804682612 },
    { "label" : "D" , "value" : 196.45946739256 },
    { "label" : "E" , "value" : 0.19434030906893 },
    { "label" : "F" , "value" : -98.079782601442 },
    { "label" : "G" , "value" : -13.925743130903 },
    { "label" : "H" , "value" : -5.1387322875705 }
  ]
}];

  res.json({graphdata:exampleData});

};

exports.getPieChartData = function (req, res) {
  var exampleData = [
    {
      key: "One",
      y: 5
    },
    {
      key: "Two",
      y: 2
    },
    {
      key: "Three",
      y: 9
    },
    {
      key: "Four",
      y: 7
    },
    {
      key: "Five",
      y: 4
    },
    {
      key: "Six",
      y: 3
    },
    {
      key: "Seven",
      y: .5
    }
  ];


  res.json({graphdata:exampleData});

};
