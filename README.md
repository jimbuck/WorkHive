WorkHive (formerly Node@home)
============

**Why a rename?** Because after 2+ years of not touching this project, I finally have time and motivation to work on it! Fresh ideas need fresh names, so while the repository is the same, the direction I want to take it is different. The codebase is squeeky clean and ready for a much simpler approach.

This is a standalone server for creating, managing and serving work items for grid-based computational networks. Grid computing allows for client browsers to run calculations and send the result back to your server. This standalone server handles all of the heavy lifting that is required to manage data, requests, and queueing.

While Javascript does not have the highest raw performance, the sheer number of devices that natively run it in the browser is overwhelming.  My end goal is to discover the power of distributed javascript computing.  If we can harness javascript on enough devices, the computational power may be sufficient to solve complex problems in sufficient time frames.

## What can I use it for?
 - Rendering and Image Processing (Render farm, image recognition, etc.)
 - Mathematical Theories and Calculations (Collatz Conjecture, N Queens, etc.)
 - Statistical Simulations and Experiments (Artificial Life, Physics Simulations, etc.)
 - Anything you can write in javascript! (Hopefully for the betterment of humanity...)

## How does it work?

WorkHive is composed of three components:

 1. Server
  - [x] Built with ExpressJS and Socket.io.
  - [ ] Stores data in NeDB data store.
  - [ ] Serves client scripts.
  - [ ] Manages work items in the queue.
  - [ ] Sends work parameters and records completed results.
 2. Workers
  - [ ] Executes compute functions against work parameters.
  - [ ] Utilizes webworkers when possible.
  - [ ] Sends results back to server.
 3. Admin
  - [ ] Simple web portal.
  - [ ] View live stats.
  - [ ] Edit the compute functions
  - [ ] Manage work item queue.
  - [ ] Disconnect workers.
  - [ ] Export results to various datatypes.
  
## How safe/reliable is it?

Security is at the utmost importance when designing a grid computation platform. Standard defenses will be in place to protect the project against rogue data. Depending on the problem, solutions will be verified through repetition or via a validate function if supplied. In the mean time, be sure to use SSL, and require multiple trials before accepting the result.