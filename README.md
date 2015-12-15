# hasten

> a tool which automatically generates a customized Gruntfile, optimized for Jenkins and local working

** work in progress **

## Description

`hasten` ist ein Tool das es ermöglicht ein Buildtask, welches eine gewisse Ordnerstruktur benötigt, einfach aufzusetzen. Um es aufzurufen braucht man nur im Terminal `hasten` aufrufen und es werden einige Sachen abgefragt (siehe unten). Um `hasten` mit den Standardeinstellungen zu laden wird lediglich das Flag `--standard` verlangt. `hasten` ist in der Lage, das `package.json` upzudaten, um alle dependencies für den Buildtask installieren zu können.

Wenn schon ein `hasten.json` existiert, wird beim starten gefragt, ob diese verändert werden möchte (express installation) oder diese noch verändert wird. So werden wieder dieselben Fragen gestellt als wäre keine `hasten.json` vorhanden. Alle getroffenen Optionen im Terminal werden in der lokalen `hasten.json` überschrieben.

## Questions

hasten asks you:

1. which task runner you want to work with
2. which framework you want to work with
  * NoFramework
  * AngularJS
  * ~~EmberJS~~ (future)
3. which folder structure you want to work with
  * default
  * extended

`then it is done`

### Choosing task runner

sollte den value weitergeben um damit später weiter arbeiten zu können

### Choosing framework

sollte den value weitergeben um damit später weiter arbeiten zu können

### Choosing folder structure

**default.** Wenn default aktiviert wurde, sollte die, sofern schon erstellte `hasten.json` im Workdirectory, mit der `hasten-default.json` kombiniert werden und in der `hasten.json` gespeichert werden. 

Das Speichern der Standardvalues in der `hasten.json` ist insofern wichtig, da `Grunt` bzw. `Gulp` mit diesem File und deren Values arbeitet.

**extended.** Wenn extended aktiviert wurde, kommt eine Art fragebogen wie bei `npm init`. Dieser geht folgende Optionen durch:

* Choose your folder to work. (Type: input. Standardvalue: `src`)
* Choose your destination folder. (Type: input. Standardvalue: `dist`)
* You want to use assets folder? (Type: question. Standardvale: `Yes`)

 **if angular framework**
* Choose your app folder. (Type: input. Standardvalue: ` ` = `src/`)

## hasten.json priority

1 will be overwritten by 2. 2 will be overwritten by 3. 3....

1. hasten-default.json
2. framework-default.json *if it is not noframework*
3. preinstalled hasten.json
4. your config from the terminal

## TODO:

* Ordnerpfade ändern
  * Steuerbar in der Konsole
  * im Nachhinein änderbar
* Auswählen von verschiedenen Frameworks (verändert Grunt, Gulp oder Node)
  * vorerst nur "NoFramework" und "AngularJS"
* Auswählen von Grunt, Gulp oder Node
  * vorerst nur Grunt
* Einzelne Grunt Plugins einausschalten
  * Doku welche Plugins es gibt
* Speichere Config datei für spätere Projekte
* Create folder structure automatically


-h, --help        Shows all functions <br />
-s, --save		  Save config into hasten.json for further projects<br /> 
-S, --standard    Force to make standardvalues<br />
-ht, --howto	  How to folderstructure

> Future: available with Gulp and Node

