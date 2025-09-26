import 'dart:typed_data';
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/route_entity.dart';
import '../../domain/repositories/delivery_repository.dart';
import '../datasources/delivery_local_datasource.dart';
import '../datasources/delivery_remote_datasource.dart';

class DeliveryRepositoryImpl implements DeliveryRepository {
  final DeliveryRemoteDataSource _remoteDataSource;
  final DeliveryLocalDataSource _localDataSource;

  DeliveryRepositoryImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<Either<Failure, List<RouteEntity>>> getRoutes() async {
    try {
      final routes = await _remoteDataSource.getRoutes();
      return Right(routes);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> startRoute(String routeId) async {
    try {
      await _remoteDataSource.startRoute(routeId);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> completeStop(String stopId) async {
    try {
      await _remoteDataSource.completeStop(stopId);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> submitEPod({
    required String signerName,
    String? signerId,
    required List<dynamic> photos,
    required Uint8List? signatureBytes,
    required String notes,
  }) async {
    try {
      await _remoteDataSource.submitEPod(
        signerName: signerName,
        signerId: signerId,
        photos: photos,
        signatureBytes: signatureBytes,
        notes: notes,
      );
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
