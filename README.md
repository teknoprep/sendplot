# SendPlot Print Server
## Requirements

### Python >= 3.8.0

#### Install

* After installation add Python & Python\\scripts folders to SYSTEM PATH

----

### IrfanView

* Version 4.37

#### Install

* Install to C:\\Program Files (x86)\\IrfanView\\
* Install IrfanView plugin: Postscript.dll to .\\plugins 
* Install IrfanView plugin: BabCAD4Image.dll to .\\plugins
* IrfanView > Option > Properties/Settings > Plugins > Postscript Options > select **Retrieve GS location from System Registry**

----

### GhostScript

* Version: 9.15

#### Install

* Install to C:\\usr\\local\\gs\\gs9.15
* Add C:\\usr\\local\\gs\\gs9.15\\bin to SYSTEM PATH
* Import registry key: **ghostscript.reg**

----

### novaPDF

  novaPDF is installed on client computers rather than the server.

  novaPDF is used to embed fonts within the CAD drawing PDF's.  

  Without embedded fonts Acrobat Readers substitute fonts not present on the viewing computer.  The results are not ideal.

#### Install

* Install novaPDF on computer that will produce PDF's from CAD files
* Use installation and setup instructions from the wiki -- http://odcl5/wiki/index.php/NovaPdfSettings

----

## Queue Setup

  * The queue folders follow a similar layout to PlotManager queues.
  * QUEUE-ROOT: The root folder of the PDF queues.  When SendPlot Print Server starts it makes a list of queues from the subfolders and monitors those folders for PDF files.  When a PDF file is copied into a QUEUE SendPlot Print Server prints it to the configured printer and removes the PDF file from the QUEUE.  If queue folders are added or removed restart SendPlot Server.
  * QUEUE: Each available printer and page size has a separate queue.  An IrfanView INI file resides in each queue.  The INI file contains configuration options for the Printer name, page size, orientation handling and output fit to page.
* Open a PDF drawing in IrfanView
* File menu > Print
* Check **Auto Rotate**
* Select Print Size > **Best fit to page (aspect ratio)**
* Position > check **Centered**
* Printer setup button > choose printer and page size
* Test the print settings and change settings if needed
* Locate the INI file with the new settings at %APPDATA%\\IrfanView\\i_view32.ini.  (Open Windows Explorer and in the address bar type **%APPDATA%\\IrfanView\\**)
* Create a new queue folder below the QUEUE-ROOT
* Copy the new IrfanView INI file to the new queue folder.  Do not make any other changes in IrfanView until after the INI file is copied.

----

# sendplot

Usage
----------------
1. Run Command Prompt(or Power Shell)
2. cd {project folder}
3. git clone https://github.com/teknoprep/sendplot.git
4. cd sendplot
5. python -m venv env
6. env/Scripts/activate (Windows)
7. pip install -r requirements.txt
8. python WebServer/app.py
9. Find localhost:5000 in your web browser.







----



Setting for Environment ( Edit .env file )
--------------------------
1. File scan locations
  <p><code><img src="https://github.com/teknoprep/sendplot/blob/main/png/git_1.png" width="800" height="400"></code><p>
2. Printers
  <p><code><img src="https://github.com/teknoprep/sendplot/blob/main/png/git_2.png" width="800" height="400"></code>


