var xmlparser=require('xml2js').parseString;
var xmlstring;
var data=["mac","fw-version","prodectmodel","bootloader","ip","netmask","gateway","dnsip","networkinterface","dhcp","232baudrate","232dataparameter","232charwaittime","232flowcontrol","485baudrate","485dataparameter","485charwaittime","ipfilter","serverconnecttime","connectioninactivetime","defeatlongack","restartlosslink","telnetIAC","serverconnectivitytimeout","serverconnectivityrelay","relaynextduration","remoteip","remoteport","retainrelaystatus","databackup","timestamp","postinterval","unitid","remotedatapath","serverpath","upsquery","httpmethod","digital1pulse","digital2pulse","digital3pulse","digital4pulse","digital5pulse","digital6pulse","digital7pulse","digital8pulse","digital9pulse","digital10pulse","digital11pulse","digital12pulse","gsm","gsmapn","gsmuserid","gsmpassword","analog1offset","analog2offset","analog3offset","analog4offset","analog5offset","analog6offset","analog7offset","analog8offset","analog1threshold","analog2threshold","analog3threshold","analog4threshold","analog5threshold","analog6threshold","analog7threshold","analog8threshold","analog1upperlimit","analog2upperlimit","analog3upperlimit","analog4upperlimit","analog5upperlimit","analog6upperlimit","analog7upperlimit","analog8upperlimit","analog1lowerlimit","analog2lowerlimit","analog3lowerlimit","analog4lowerlimit","analog5lowerlimit","analog6lowerlimit","analog7lowerlimit","analog8lowerlimit","analog1method","analog2method","analog3method","analog4method","analog5method","analog6method","analog7method","analog8method","analog1relay","analog2relay","analog3relay","analog4relay","analog5relay","analog6relay","analog7relay","analog8relay","masternumber","phonenumber1","phonenumber2","phonenumber3","phonenumber4","phonenumber5","phonenumber6","phonenumber7","phonenumber8","phonenumber9","phonenumber10","loginuser","loginpassword","SFD","DLM","packettry","responsetimeout","ntp","ntpip","ntpport","ntpupdateinterval","ntptimezone","rtcdate","rtctime"];
var dlmindex;
var dlmlastindex;
var sfdindex;
var sfdlastindex;
var dlm;
var sfd;


var init=function(xmlstring){
    var xmlstring=xmlstring;
    this.dlmindex=xmlstring.indexOf("DLM")+4;
    this.dlmlastindex=xmlstring.lastIndexOf("DLM")-2;
    this.sfdindex=xmlstring.indexOf("SFD")+4;
    this.sfdlastindex=xmlstring.lastIndexOf("SFD")-2;
    var dlm=xmlstring.substring(this.dlmindex,this.dlmlastindex);
    var sfd=xmlstring.substring(this.sfdindex,this.sfdlastindex);
    xmlstring=xmlstring.substring(0,this.sfdindex-5)+xmlstring.substring(this.dlmlastindex+6,xmlstring.length);
    xmlstring=refine(xmlstring,false);
    xmlparser(xmlstring,function(err,result){
        if(err) {console.log(err);}
        result.config.DLM=[dlm];
        result.config.SFD=[sfd];
        result=refine(JSON.stringify(result),true);
        result=JSON.parse(result);
        xmlstring=result;
    });
        return xmlstring.config;
}
module.exports=init;

function refine(xmldata,invert) //send invert true to put out data back into original form
{
    
    var toreplace;
    var replacement;
    if(invert){
        toreplace=["ttt","fef"];
        replacement=["232","485"];
    }
    if(!invert){
        toreplace=["232","485"];
        replacement=["ttt","fef"];
    }
    while(xmldata.indexOf(toreplace[0])!=-1)
    {
    xmldata=xmldata.replace(toreplace[0],replacement[0]);
    }
    while(xmldata.indexOf(toreplace[1])!=-1)
    {
    xmldata=xmldata.replace(toreplace[1],replacement[1]);
    }
    return xmldata;
}



