import { Serializer } from '@nestjs/microservices';
import { isNil, isString, isObject } from '@nestjs/common/utils/shared.utils';

export class KafkaJsonSerializer implements Serializer<any, any> {
  serialize(value: any): any {
    const isNotKafkaMessage =
      isNil(value) ||
      !isObject(value) ||
      (!('key' in value) && !('value' in value));

    if (isNotKafkaMessage) {
      value = { value };
    }

    value.value = this.encode(value.value);

    if (!isNil(value.key)) {
      value.key = this.encode(value.key);
    }

    if (isNil(value.headers)) {
      value.headers = {};
    }

    return value;
  }

  encode(value: any): any {
    if (isNil(value)) {
      return null;
    }
    if (Buffer.isBuffer(value)) {
      return value;
    }
    if (isString(value)) {
      return value;
    }
    return JSON.stringify(value);
  }
}
