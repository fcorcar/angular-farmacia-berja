export interface ConfiguracionResponse {
  documents: ConfigurationItem[];
}

export interface ConfigurationItem {
  name:       string;
  fields:     Fields;
  createTime: Date;
  updateTime: Date;
}

export interface Fields {
  anchorDate:    AnchorDate;
  messageNotice: AnchorDate;
  patternId:  PatternID;
}

export interface PatternID {
  arrayValue: ArrayValue;
}

export interface ArrayValue {
  values: Value[];
}

export interface Value {
  integerValue: string;
}

export interface AnchorDate {
  stringValue: string;
}
