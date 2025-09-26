import 'package:shared_preferences/shared_preferences.dart';

abstract class DeliveryLocalDataSource {
  Future<void> saveRouteData(String routeId, Map<String, dynamic> data);
  Future<Map<String, dynamic>?> getRouteData(String routeId);
  Future<void> clearRouteData(String routeId);
  Future<void> saveOfflineData(String key, Map<String, dynamic> data);
  Future<Map<String, dynamic>?> getOfflineData(String key);
}

class DeliveryLocalDataSourceImpl implements DeliveryLocalDataSource {
  final SharedPreferences _prefs;

  DeliveryLocalDataSourceImpl(this._prefs);

  @override
  Future<void> saveRouteData(String routeId, Map<String, dynamic> data) async {
    await _prefs.setString('route_$routeId', data.toString());
  }

  @override
  Future<Map<String, dynamic>?> getRouteData(String routeId) async {
    final data = _prefs.getString('route_$routeId');
    if (data == null) return null;
    
    // This should be proper JSON deserialization
    return {};
  }

  @override
  Future<void> clearRouteData(String routeId) async {
    await _prefs.remove('route_$routeId');
  }

  @override
  Future<void> saveOfflineData(String key, Map<String, dynamic> data) async {
    await _prefs.setString('offline_$key', data.toString());
  }

  @override
  Future<Map<String, dynamic>?> getOfflineData(String key) async {
    final data = _prefs.getString('offline_$key');
    if (data == null) return null;
    
    // This should be proper JSON deserialization
    return {};
  }
}
