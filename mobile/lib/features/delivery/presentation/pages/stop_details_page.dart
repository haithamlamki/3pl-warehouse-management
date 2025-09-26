import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/delivery_provider.dart';
import '../../domain/entities/route_entity.dart';

class StopDetailsPage extends ConsumerWidget {
  final String stopId;

  const StopDetailsPage({
    super.key,
    required this.stopId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // This would typically fetch stop details from the API
    // For now, we'll use mock data
    final stop = _getMockStop();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Stop Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.navigation),
            onPressed: () {
              _openMaps(stop);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stop Header Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: _getStatusColor(stop.status),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            stop.status.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Stop #${stop.sequence}',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    _buildInfoRow(
                      context,
                      Icons.location_on,
                      'Address',
                      stop.address ?? 'Address not available',
                    ),
                    
                    if (stop.eta != null) ...[
                      _buildInfoRow(
                        context,
                        Icons.schedule,
                        'ETA',
                        _formatDateTime(stop.eta!),
                      ),
                    ],
                    
                    if (stop.actualArrival != null) ...[
                      _buildInfoRow(
                        context,
                        Icons.check_circle,
                        'Arrived At',
                        _formatDateTime(stop.actualArrival!),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Order Details
            if (stop.order != null) ...[
              Text(
                'Order Details',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoRow(
                        context,
                        Icons.receipt,
                        'Order ID',
                        stop.order!.id,
                      ),
                      _buildInfoRow(
                        context,
                        Icons.category,
                        'Type',
                        stop.order!.type,
                      ),
                      _buildInfoRow(
                        context,
                        Icons.info,
                        'Status',
                        stop.order!.status,
                      ),
                      if (stop.order!.notes != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Notes:',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          stop.order!.notes!,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Order Lines
              Text(
                'Items (${stop.order!.lines.length})',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              
              ...stop.order!.lines.map((line) => _buildOrderLineCard(context, line)),
            ],
            
            const SizedBox(height: 24),
            
            // Action Buttons
            if (stop.status.toLowerCase() == 'pending') ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    _arriveAtStop(context, ref);
                  },
                  icon: const Icon(Icons.location_on),
                  label: const Text('Arrive at Stop'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
            
            if (stop.status.toLowerCase() == 'in_progress') ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    context.go('/home/route/route_123/stop/$stopId/epod');
                  },
                  icon: const Icon(Icons.check_circle),
                  label: const Text('Complete Delivery'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderLineCard(BuildContext context, OrderLineEntity line) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.blue[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.inventory,
                color: Colors.blue,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    line.itemSku,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Qty: ${line.qty.toStringAsFixed(0)}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            if (line.lotId != null) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Lot: ${line.lotId}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.grey;
      case 'in_progress':
        return Colors.orange;
      case 'completed':
        return Colors.green;
      case 'failed':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  void _openMaps(RouteStopEntity stop) {
    if (stop.latitude != null && stop.longitude != null) {
      // Open maps with coordinates
      // This would typically use a maps plugin
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Opening maps...'),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Location coordinates not available'),
        ),
      );
    }
  }

  void _arriveAtStop(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Arrive at Stop'),
        content: const Text('Mark this stop as arrived?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(deliveryProvider.notifier).completeStop(stopId);
            },
            child: const Text('Arrive'),
          ),
        ],
      ),
    );
  }

  // Mock data - this would typically come from the API
  RouteStopEntity _getMockStop() {
    return RouteStopEntity(
      id: stopId,
      orderId: 'order_123',
      sequence: 1,
      status: 'pending',
      eta: DateTime.now().add(const Duration(hours: 1)),
      address: '123 Main Street, City, Country',
      latitude: 24.7136,
      longitude: 46.6753,
      order: OrderEntity(
        id: 'order_123',
        type: 'OUT',
        status: 'APPROVED',
        notes: 'Please deliver to front door',
        lines: [
          OrderLineEntity(
            id: 'line_1',
            itemSku: 'ITEM001',
            qty: 10,
            lotId: 'LOT001',
          ),
          OrderLineEntity(
            id: 'line_2',
            itemSku: 'ITEM002',
            qty: 5,
          ),
        ],
      ),
    );
  }
}
