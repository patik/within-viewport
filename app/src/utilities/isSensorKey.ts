import sensorList from './sensorList'

export function isSensorKey(str: string): str is SensorKey {
    return Boolean(str in sensorList)
}
