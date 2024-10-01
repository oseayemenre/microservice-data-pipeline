docker-start-broker:
	docker-compose -f docker-compose.broker.yml up -d
	
docker-kafka-shell:
	winpty docker-compose -f docker-compose.broker.yml exec -it kafka sh
