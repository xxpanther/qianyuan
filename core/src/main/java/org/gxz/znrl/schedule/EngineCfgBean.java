package org.gxz.znrl.schedule;

/**
 * @author xieyt
 */
public class EngineCfgBean {
    private String taskConfId = null;
    private String taskType = null;
    private String invokeObjType = null;
    private String invokeObj = null;
    private String cronTrigExpr = null;
    private String remark = null;
    private String name = null;

    //附加配置
    private String attachCfgId = null;
    private String dbSource = null;
    private String ourDBSource = null;
    private String sqlId = null;
    private String writeBackTag = null;
    private String writeBackSqlId = null;
    private String wbParam1Type = null;
    private String wbParam2Type = null;
    private String wbParam1Field = null;
    private String wbParam2Field = null;
    private String supportMachine = null;

    public String getSupportMachine() {
        return supportMachine;
    }

    public void setSupportMachine(String supportMachine) {
        this.supportMachine = supportMachine;
    }

    public String getOurDBSource() {
        return ourDBSource;
    }

    public void setOurDBSource(String ourDBSource) {
        this.ourDBSource = ourDBSource;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWbParam1Field() {
        return wbParam1Field;
    }

    public void setWbParam1Field(String wbParam1Field) {
        this.wbParam1Field = wbParam1Field;
    }

    public String getWbParam2Field() {
        return wbParam2Field;
    }

    public void setWbParam2Field(String wbParam2Field) {
        this.wbParam2Field = wbParam2Field;
    }

    public String getWbParam1Type() {
        return wbParam1Type;
    }

    public void setWbParam1Type(String wbParam1Type) {
        this.wbParam1Type = wbParam1Type;
    }

    public String getWbParam2Type() {
        return wbParam2Type;
    }

    public void setWbParam2Type(String wbParam2Type) {
        this.wbParam2Type = wbParam2Type;
    }

    public String getAttachCfgId() {
        return attachCfgId;
    }

    public void setAttachCfgId(String attachCfgId) {
        this.attachCfgId = attachCfgId;
    }

    public String getDbSource() {
        return dbSource;
    }

    public void setDbSource(String dbSource) {
        this.dbSource = dbSource;
    }

    public String getSqlId() {
        return sqlId;
    }

    public void setSqlId(String sqlId) {
        this.sqlId = sqlId;
    }

    public String getWriteBackTag() {
        return writeBackTag;
    }

    public void setWriteBackTag(String writeBackTag) {
        this.writeBackTag = writeBackTag;
    }

    public String getWriteBackSqlId() {
        return writeBackSqlId;
    }

    public void setWriteBackSqlId(String writeBackSqlId) {
        this.writeBackSqlId = writeBackSqlId;
    }

    public String getTaskConfId() {
        return taskConfId;
    }

    public void setTaskConfId(String taskConfId) {
        this.taskConfId = taskConfId;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getInvokeObjType() {
        return invokeObjType;
    }

    public void setInvokeObjType(String invokeObjType) {
        this.invokeObjType = invokeObjType;
    }

    public String getInvokeObj() {
        return invokeObj;
    }

    public void setInvokeObj(String invokeObj) {
        this.invokeObj = invokeObj;
    }

    public String getCronTrigExpr() {
        return cronTrigExpr;
    }

    public void setCronTrigExpr(String cronTrigExpr) {
        this.cronTrigExpr = cronTrigExpr;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
