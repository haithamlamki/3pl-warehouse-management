import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/route_entity.dart';
import '../repositories/delivery_repository.dart';

class GetRoutesUseCase {
  final DeliveryRepository _repository;

  GetRoutesUseCase(this._repository);

  Future<Either<Failure, List<RouteEntity>>> call() async {
    return await _repository.getRoutes();
  }
}
