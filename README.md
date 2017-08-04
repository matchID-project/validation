This repository is part of a wider project called *matchID* (to be fully released soon).

### :squirrel: about *matchID* :squirrel:

 *matchID* aims at helping developers (and organizations) to match people's identities, a kind of [dedupe library](https://github.com/dedupeio/dedupe) but focused mainly on people.

Two main applications :
- **link a database** filled with people informations **to another database** also filled with people informations
- **remove duplicate people** from a database

> *matchID* is developed by @rhanka and @SuperKiwi who is part of the ["Entrepreneur d'Intérêt Général" 2017 program](https://www.etalab.gouv.fr/entrepreneurs-dinteret-general), a French presidential program aiming to bring tech people into working for an administration for a 10 month period — inspired by Obama's [Presidential Innovation Fellows (PIF)](https://pif.gov/).

# *matchID validation*

The goal of this repository (the *validation* sub-project) is to provide an user-friendly interface to display matching results of *matchID-backend* (to be released soon).

**It allows users to easily visualize matchs between people.**

Main used technologies are **VueJs** and **ElasticSearch**.
> An **elasticsearch instance running is mandatory** to make this application work

![Screenshot Full](./docs/assets/full.png "matchID validation appearance")


1. [Visual Tour](#visual-tour)
  1. [Navbar](#navbar)
  2. [Controller](#controller)
  3. [Data Table](#data-table)
2. [Configuration](#configuration)
3. [Keyboard shortcuts](#keyboard-shortcuts)

## 1. Visual tour

### 1.1 - Navbar

![Screenshot Navbar](./docs/assets/navbar.png "matchID validation Navbar")

##### There are four different parts in the navbar:


<img src="./docs/assets/navbar-globe.png" height="26">  
_Change the language of your app_

<img src="./docs/assets/navbar-green-check.png" height="26"> / <img src="./docs/assets/navbar-red-cross.png" height="26">  
_Green check or Red cross if connection to Elasticsearch is working_

<img src="./docs/assets/navbar-keyboard.png" height="26">  
_Keyboard shortcuts cheatsheet_

<img src="./docs/assets/navbar-statistics.png" height="26">  
_Statistics on processed matchs_

------

### 1.2 - Table Controller

<img src="./docs/assets/controller.png" height="28">

##### There are also four parts in the controller :

<img src="./docs/assets/controller-query.png" height="28">  
_Query we are sending to Elasticsearch_

<img src="./docs/assets/controller-range.png" height="28">   
_Range filter if you have a score column on your datasets_

<img src="./docs/assets/controller-filter.png" height="28">  
_Filter through results from Elasticsearch with text filtering_

<img src="./docs/assets/controller-onlyUndone.png" height="28">  
_Filter through results from Elasticsearch depending on the fact that a match has been already processed or not_

------

### 1.3 - Data Table

<img src="./docs/assets/dataTable.png">
>Please note that all data displayed here is dummy randomized data

The data table lists all different matchs found by *matchID backend*. Except the two columns *Results* and *Status*, all other **columns can be customized**.

> #### Generally speaking, many things can be customized to your needs in *matchID validation*

- *Results* column are pre-computed results according to the score (displayed in the previous column). In this example:
  - if the *score* is above 55, the first checkbox (`validation_decision`) will be set to `true`
  - if the *score* is between 40 and 65, the question mark checkbox (`validation_indecision`) will be set to `true`
- *Status* column is checked to true once you consider that the results (`validation_decision` and `validation_indecision`) are correct



## 2. Configuration

> *To set up the project to your needs,
all you need to change is located in the [matchIdConfig directory](./matchIdConfig/)*

### 2.1 Configuring Elasticsearch

#### 2.1.1 Installation

To install and configure elasticsearch on your server or localhost, please follow [official guidelines](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)

> Note sure about the minimum required version of `elasticsearch` which is needed. We used `5.x` versions to develop *matchID*

#### 2.1.2 Data Mapping

Depending on


## 3. Keyboard Shortcuts

`Ctrl`+ `Alt` will enable/disable the shortcuts.

Once enabled, the following ones are available :
- `a` will change the pre-computed decision (`validation_decision`)
- `e` will change the pre-computed indecision (`validation_indecision`)
- `Arrow UP` and `Arrow DOWN` allow you to move between rows
