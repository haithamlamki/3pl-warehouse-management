import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/delivery_repository.dart';

class CompleteStopUseCase {
  final DeliveryRepository _repository;

  CompleteStopUseCase(this._repository);

  Future<Either<Failure, void>> call(CompleteStopParams params) async {
    return await _repository.completeStop(params.stopId);
  }
}

class CompleteStopParams {
  final String stopId;

  CompleteStopParams({required this.stopId});
}
