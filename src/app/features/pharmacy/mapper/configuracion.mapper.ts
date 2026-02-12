import { Configuration } from "../interfaces/configuracion.interface";
import { ConfigurationItem } from "../interfaces/firebase-configuracion.interfaces";


export class ConfigurationMapper {
  static mapFirebaseConfigurationToConfiguration(item: ConfigurationItem): Configuration {

    return {
      patternId: (item.fields.patternId.arrayValue.values).map( val =>
        parseInt(val.integerValue)
      ),
      anchorDate: item.fields.anchorDate.stringValue,
      messageNotice: item.fields.messageNotice.stringValue
    };
  }

  static mapFirebaseConfigurationToConfigurationArray(items: ConfigurationItem[]): Configuration[] {
    return items.map(this.mapFirebaseConfigurationToConfiguration);
  }

}
