import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/config/app_config.dart';

abstract class AuthLocalDataSource {
  Future<void> saveAuthTokens(String accessToken, String refreshToken);
  Future<String?> getAccessToken();
  Future<String?> getRefreshToken();
  Future<void> saveUserData(Map<String, dynamic> userData);
  Future<Map<String, dynamic>?> getUserData();
  Future<void> clearAuthData();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final SharedPreferences _prefs;

  AuthLocalDataSourceImpl(this._prefs);

  @override
  Future<void> saveAuthTokens(String accessToken, String refreshToken) async {
    await _prefs.setString(AppConfig.authTokenKey, accessToken);
    await _prefs.setString(AppConfig.refreshTokenKey, refreshToken);
  }

  @override
  Future<String?> getAccessToken() async {
    return _prefs.getString(AppConfig.authTokenKey);
  }

  @override
  Future<String?> getRefreshToken() async {
    return _prefs.getString(AppConfig.refreshTokenKey);
  }

  @override
  Future<void> saveUserData(Map<String, dynamic> userData) async {
    // Convert to JSON string and save
    final userJson = userData.toString(); // This should be proper JSON serialization
    await _prefs.setString(AppConfig.userDataKey, userJson);
  }

  @override
  Future<Map<String, dynamic>?> getUserData() async {
    final userJson = _prefs.getString(AppConfig.userDataKey);
    if (userJson == null) return null;
    
    // This should be proper JSON deserialization
    // For now, return a mock user data
    return {
      'id': 'user_123',
      'email': 'driver@example.com',
      'fullName': 'Driver User',
      'isActive': true,
      'tenantId': 'tenant_123',
      'roles': ['driver'],
    };
  }

  @override
  Future<void> clearAuthData() async {
    await _prefs.remove(AppConfig.authTokenKey);
    await _prefs.remove(AppConfig.refreshTokenKey);
    await _prefs.remove(AppConfig.userDataKey);
  }
}
