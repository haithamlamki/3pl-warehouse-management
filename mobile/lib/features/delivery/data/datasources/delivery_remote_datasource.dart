import 'dart:typed_data';
import 'package:dio/dio.dart';
import '../../domain/entities/route_entity.dart';

abstract class DeliveryRemoteDataSource {
  Future<List<RouteEntity>> getRoutes();
  Future<void> startRoute(String routeId);
  Future<void> completeStop(String stopId);
  Future<void> submitEPod({
    required String signerName,
    String? signerId,
    required List<dynamic> photos,
    required Uint8List? signatureBytes,
    required String notes,
  });
}

class DeliveryRemoteDataSourceImpl implements DeliveryRemoteDataSource {
  final Dio _dio;

  DeliveryRemoteDataSourceImpl(this._dio);

  @override
  Future<List<RouteEntity>> getRoutes() async {
    final response = await _dio.get('/routes');
    final routesData = response.data as List<dynamic>;
    
    return routesData
        .map((route) => RouteEntity.fromJson(route as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<void> startRoute(String routeId) async {
    await _dio.post('/routes/$routeId/start');
  }

  @override
  Future<void> completeStop(String stopId) async {
    await _dio.post('/routes/stops/complete', data: { 'stopId': stopId });
  }

  @override
  Future<void> submitEPod({
    required String signerName,
    String? signerId,
    required List<dynamic> photos,
    required Uint8List? signatureBytes,
    required String notes,
  }) async {
    final formData = FormData.fromMap({
      'signerName': signerName,
      if (signerId != null) 'signerId': signerId,
      'notes': notes,
      if (signatureBytes != null)
        'signature': MultipartFile.fromBytes(
          signatureBytes,
          filename: 'signature.png',
        ),
      // Add photos as multipart files
      for (int i = 0; i < photos.length; i++)
        'photos': MultipartFile.fromFileSync(
          photos[i].path,
          filename: 'photo_$i.jpg',
        ),
    });

    await _dio.post('/routes/stops/complete', data: formData);
  }
}
