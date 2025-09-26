import 'dart:typed_data';
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/route_entity.dart';

abstract class DeliveryRepository {
  Future<Either<Failure, List<RouteEntity>>> getRoutes();
  Future<Either<Failure, void>> startRoute(String routeId);
  Future<Either<Failure, void>> completeStop(String stopId);
  Future<Either<Failure, void>> submitEPod({
    required String signerName,
    String? signerId,
    required List<dynamic> photos,
    required Uint8List? signatureBytes,
    required String notes,
  });
}
