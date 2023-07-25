import { VisfloScript } from '@visflo/grammar';

export const startScript = {
	version: 0,
	definition: {
		properties: {
			inputs: {
				variables: [
					{
						name: 'waterLevel',
						type: 'number'
					}
				]
			},
			outputs: {
				variables: [
					{
						name: 'lockLevel',
						type: 'number'
					}
				]
			}
		},
		sequence: [
			{
				id: '6cee62114555b4f8c14a7d6efcedec7d',
				type: 'ifVisflo',
				componentType: 'switch',
				name: '$waterLevel > 80',
				properties: {
					a: {
						modelId: 'nullableAnyVariable',
						value: {
							name: 'waterLevel',
							type: 'number'
						}
					},
					comparison: '>',
					b: {
						modelId: 'number',
						value: 80
					}
				},
				branches: {
					true: [
						{
							id: 'db34db08ec2a2fc84fe0117f1fe07d88',
							type: 'setNumber',
							componentType: 'task',
							properties: {
								variable: {
									name: 'lockLevel'
								},
								value: 0
							},
							name: '$lockLevel = 0'
						}
					],
					false: [
						{
							id: '65b62923925bec0d51ac96916ff6c316',
							type: 'ifVisflo',
							componentType: 'switch',
							properties: {
								a: {
									modelId: 'nullableAnyVariable',
									value: {
										name: 'waterLevel',
										type: 'number'
									}
								},
								comparison: '>=',
								b: {
									modelId: 'number',
									value: 50
								}
							},
							branches: {
								true: [
									{
										id: '8083ff0b920013b2704256f07d477b4c',
										type: 'equationVisflo',
										componentType: 'task',
										properties: {
											result: {
												name: 'lockLevel'
											},
											a: {
												modelId: 'number',
												value: 100
											},
											operator: '-',
											b: {
												modelId: 'nullableVariable',
												value: {
													name: 'waterLevel'
												}
											}
										},
										name: '$lockLevel = 100 - $waterLevel'
									}
								],
								false: [
									{
										id: '5939c7c0c079423832801b540200cab0',
										type: 'setNumber',
										componentType: 'task',
										properties: {
											variable: {
												name: 'lockLevel'
											},
											value: 100
										},
										name: '$lockLevel = 100'
									}
								]
							},
							name: '$waterLevel >= 50'
						}
					]
				}
			}
		]
	}
} as unknown as VisfloScript;
