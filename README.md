Node@home
============

This is a standalone server for creating, managing and serving work items for grid-based computational networks. Grid computing allows for client browsers to run calculations and send the result back to your server. This module makes it easy to create a server that will manage data, requests, and queueing.

While Javascript does not have the highest performance, the sheer number of devices that natively run it in the browser is overwhelming.  If we can harness the javascript power on every device, the computational power would be astronomical.

What can I use it for?
=====================
 - Rendering Farms and Image Processing
 - Collatz Conjecture and other Mathematical Theories
 - Statistical Simulations and other Experiments
 - Anything you can program! (Hopefully for the betterment of humanity...)

How does it work?
==================

The server is built on express and handles three main modules.

 1. Grid
  - Serves client scripts and data
  - Recieves and records calculated results.
 2. Stats
  - Displays general information and statistics for a project.
 3. Admin
  - Manage input data sets
  - Edit the compute functions
 
Once your server is running, add `<script type="text/javascript" src="HOST:PORT/client.js"/>` and it will handle the rest!


How safe/reliable is it?
=================

Security is at the utmost importance when designing a grid computation platform. Standard defenses will be in place to protect the project against rogue data.

Depending on the problem, solutions will be verified through repitition or via a validate function if supplied.