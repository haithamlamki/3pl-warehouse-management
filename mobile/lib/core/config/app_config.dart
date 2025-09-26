class AppConfig {
  static const String appName = '3PL Driver';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String baseUrl = 'http://localhost:3001';
  static const String apiVersion = '/api/v1';
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String settingsKey = 'app_settings';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Location
  static const double defaultLatitude = 24.7136;
  static const double defaultLongitude = 46.6753;
  static const double locationAccuracy = 10.0;
  
  // Camera
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageFormats = ['jpg', 'jpeg', 'png'];
  
  // Signature
  static const double signatureStrokeWidth = 2.0;
  static const Color signatureColor = Colors.black;
}
