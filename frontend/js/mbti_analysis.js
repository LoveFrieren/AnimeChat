const individualDescriptions = {
  "ISTJ": "{name}（ISTJ）是可靠的守护者，做事严谨、有责任感，注重细节与秩序。在乐队中是稳定的基石，虽不张扬，但总能默默支撑团队运转。",
  "ISFJ": "{name}（ISFJ）是温暖的守护者，体贴他人、富有同理心，善于营造和谐氛围。ta会默默记住每位成员的喜好，在排练间隙递上热茶。",
  "INFJ": "{name}（INFJ）是深邃的理想主义者，富有洞察力与使命感，追求意义与深度。ta的歌词往往充满哲思，能触动听众内心最柔软的角落。",
  "INTJ": "{name}（INTJ）是冷静的战略家，目标明确、逻辑缜密，擅长长远规划。ta会为乐队制定三年发展路线图，并严格执行。",
  "ISTP": "{name}（ISTP）是沉静的工匠，动手能力强，临危不乱，享受技术挑战。ta能在演出前5分钟修好故障的音箱，然后淡定地走上舞台。",
  "ISFP": "{name}（ISFP）是温柔的艺术家，敏感细腻、忠于自我，用作品表达情感。ta的旋律如涓涓细流，不喧哗却直抵人心。",
  "INFP": "{name}（INFP）是诗意的梦想家，理想主义、富有同情心，追求真实与美。ta写歌不是为了流行，而是为了治愈一个孤独的灵魂。",
  "INTP": "{name}（INTP）是好奇的思考者，热爱分析、追求逻辑自洽，常陷入深度思考。ta可能会在排练时突然停下：“等等，这个和弦进行不符合数学美感。”",
  "ESTP": "{name}（ESTP）是活力的实干家，行动迅速、适应力强，享受当下与刺激。ta是Livehouse的宠儿，总能带动全场气氛。",
  "ESFP": "{name}（ESFP）是热情的表演者，开朗外向、富有感染力，活在聚光灯下。ta的舞台表现力极强，一个眼神就能点燃观众。",
  "ENFP": "{name}（ENFP）是热情的倡导者，创意无限、善于激励，总能看到可能性。ta会突然提议：“我们明天去海边即兴演出吧！”",
  "ENTP": "{name}（ENTP）是机智的辩论家，思维敏捷、喜欢挑战常规，点子层出不穷。ta总在讨论：“如果把这首摇滚改成爵士会怎样？”",
  "ESTJ": "{name}（ESTJ）是高效的组织者，务实果断、注重效率，擅长管理与执行。ta会制作详细的排练日程表，并确保每人准时到场。",
  "ESFJ": "{name}（ESFJ）是贴心的协调者，乐于助人、重视和谐，善于照顾他人感受。ta会记得谁今天心情不好，并悄悄送上鼓励。",
  "ENFJ": "{name}（ENFJ）是魅力的引导者，富有同理心、善于鼓舞人心，天生的领导者。ta能让每个成员都感受到自己的价值。",
  "ENTJ": "{name}（ENTJ）是果敢的指挥官，自信坚定、目标导向，擅长统筹全局。ta会说：“我们的目标不是地下乐队，而是武道馆！”"
};

const pairDescriptions = {
  "ISTJ-ISFJ": "{name1}（ISTJ）与{name2}（ISFJ）是“双守护者”组合：一个重规则与责任，一个重关怀与和谐。在乐队中，ta们共同维系秩序与温暖，是团队最稳定的后盾。",
  "ISFJ-ISTJ": "{name1}（ISFJ）与{name2}（ISTJ）是“双守护者”组合：一个重规则与责任，一个重关怀与和谐。在乐队中，ta们共同维系秩序与温暖，是团队最稳定的后盾。",
  
  "ISTJ-INFJ": "{name1}（ISTJ）与{name2}（INFJ）形成“现实与理想”的张力：前者关注当下执行，后者着眼长远愿景。若能互相尊重，可实现脚踏实地的理想主义。",
  "INFJ-ISTJ": "{name1}（INFJ）与{name2}（ISTJ）形成“现实与理想”的张力：前者关注当下执行，后者着眼长远愿景。若能互相尊重，可实现脚踏实地的理想主义。",
  
  "ISTJ-INTJ": "{name1}（ISTJ）与{name2}（INTJ）是“理性双杰”：都追求逻辑与效率，但ISTJ依赖经验，INTJ依赖战略。合作时需明确分工，避免过度批判。",
  "INTJ-ISTJ": "{name1}（INTJ）与{name2}（ISTJ）是“理性双杰”：都追求逻辑与效率，但ISTJ依赖经验，INTJ依赖战略。合作时需明确分工，避免过度批判。",
  
  "ISTJ-ISTP": "{name1}（ISTJ）与{name2}（ISTP）是“秩序与自由”的碰撞：一个喜欢计划，一个随性应变。在设备维护或技术调试上配合极佳，但需包容彼此节奏。",
  "ISTP-ISTJ": "{name1}（ISTP）与{name2}（ISTJ）是“秩序与自由”的碰撞：一个喜欢计划，一个随性应变。在设备维护或技术调试上配合极佳，但需包容彼此节奏。",
  
  "ISTJ-ISFP": "{name1}（ISTJ）与{name2}（ISFP）看似迥异：一个重责任，一个重感受。但ISTJ的可靠能让ISFP安心创作，ISFP的温柔也能软化ISTJ的严肃。",
  "ISFP-ISTJ": "{name1}（ISFP）与{name2}（ISTJ）看似迥异：一个重责任，一个重感受。但ISTJ的可靠能让ISFP安心创作，ISFP的温柔也能软化ISTJ的严肃。",
  
  "ISTJ-INFP": "{name1}（ISTJ）与{name2}（INFP）代表“现实与诗意”的对话：一个务实高效，一个理想浪漫。若ISTJ学会欣赏INFP的深度，INFP理解ISTJ的担当，将互补共生。",
  "INFP-ISTJ": "{name1}（INFP）与{name2}（ISTJ）代表“现实与诗意”的对话：一个务实高效，一个理想浪漫。若ISTJ学会欣赏INFP的深度，INFP理解ISTJ的担当，将互补共生。",
  
  "ISTJ-INTP": "{name1}（ISTJ）与{name2}（INTP）是“经验与理论”的交汇：ISTJ相信“过去怎么做”，INTP追问“为什么这么做”。在编曲讨论中可能争执，但能催生创新方案。",
  "INTP-ISTJ": "{name1}（INTP）与{name2}（ISTJ）是“经验与理论”的交汇：ISTJ相信“过去怎么做”，INTP追问“为什么这么做”。在编曲讨论中可能争执，但能催生创新方案。",
  
  "ISTJ-ESTP": "{name1}（ISTJ）与{name2}（ESTP）是“计划与即兴”的对决：一个提前排练十遍，一个现场发挥最佳。若ESTP尊重流程，ISTJ接纳灵活，可打造既有精度又有活力的演出。",
  "ESTP-ISTJ": "{name1}（ESTP）与{name2}（ISTJ）是“计划与即兴”的对决：一个提前排练十遍，一个现场发挥最佳。若ESTP尊重流程，ISTJ接纳灵活，可打造既有精度又有活力的演出。",
  
  "ISTJ-ESFP": "{name1}（ISTJ）与{name2}（ESFP）是“幕后与台前”的搭档：ISTJ确保一切就绪，ESFP点燃全场热情。只要ESFP不迟到，ISTJ不唠叨，便是完美组合。",
  "ESFP-ISTJ": "{name1}（ESFP）与{name2}（ISTJ）是“幕后与台前”的搭档：ISTJ确保一切就绪，ESFP点燃全场热情。只要ESFP不迟到，ISTJ不唠叨，便是完美组合。",
  
  "ISTJ-ENFP": "{name1}（ISTJ）与{name2}（ENFP）是“结构与灵感”的融合：ENFP不断提出新点子，ISTJ帮其落地执行。ISTJ需忍耐ENFP的跳跃，ENFP需理解ISTJ的条理。",
  "ENFP-ISTJ": "{name1}（ENFP）与{name2}（ISTJ）是“结构与灵感”的融合：ENFP不断提出新点子，ISTJ帮其落地执行。ISTJ需忍耐ENFP的跳跃，ENFP需理解ISTJ的条理。",
  
  "ISTJ-ENTP": "{name1}（ISTJ）与{name2}（ENTP）是“守成与颠覆”的拉锯：ENTP总想改谱子，ISTJ坚持原版。若设定“创意时间”与“执行时间”，可化冲突为创造力。",
  "ENTP-ISTJ": "{name1}（ENTP）与{name2}（ISTJ）是“守成与颠覆”的拉锯：ENTP总想改谱子，ISTJ坚持原版。若设定“创意时间”与“执行时间”，可化冲突为创造力。",
  
  "ISTJ-ESTJ": "{name1}（ISTJ）与{name2}（ESTJ）是“双SJ”高效组合：都重视责任、传统与结果。在乐队管理、财务、日程安排上无懈可击，但需警惕过于僵化而失去艺术性。",
  "ESTJ-ISTJ": "{name1}（ESTJ）与{name2}（ISTJ）是“双SJ”高效组合：都重视责任、传统与结果。在乐队管理、财务、日程安排上无懈可击，但需警惕过于僵化而失去艺术性。",
  
  "ISTJ-ESFJ": "{name1}（ISTJ）与{name2}（ESFJ）是“责任与关怀”的联盟：一个确保任务完成，一个确保成员开心。是乐队运营的黄金搭档，尤其适合处理对外事务与内部关系。",
  "ESFJ-ISTJ": "{name1}（ESFJ）与{name2}（ISTJ）是“责任与关怀”的联盟：一个确保任务完成，一个确保成员开心。是乐队运营的黄金搭档，尤其适合处理对外事务与内部关系。",
  
  "ISTJ-ENFJ": "{name1}（ISTJ）与{name2}（ENFJ）是“务实与鼓舞”的结合：ENFJ激励团队士气，ISTJ落实具体行动。只要ENFJ不过度情感化，ISTJ不过度批判，便能协同增效。",
  "ENFJ-ISTJ": "{name1}（ENFJ）与{name2}（ISTJ）是“务实与鼓舞”的结合：ENFJ激励团队士气，ISTJ落实具体行动。只要ENFJ不过度情感化，ISTJ不过度批判，便能协同增效。",
  
  "ISTJ-ENTJ": "{name1}（ISTJ）与{name2}（ENTJ）是“执行者与指挥官”的经典搭配：ENTJ制定战略，ISTJ高效执行。若ENTJ给予ISTJ足够信任，ISTJ提供稳定反馈，乐队将稳步前进。",
  "ENTJ-ISTJ": "{name1}（ENTJ）与{name2}（ISTJ）是“执行者与指挥官”的经典搭配：ENTJ制定战略，ISTJ高效执行。若ENTJ给予ISTJ足够信任，ISTJ提供稳定反馈，乐队将稳步前进。",

  "ISFJ-INFJ": "{name1}（ISFJ）与{name2}（INFJ）是“双NFJ”关怀组合：都富有同理心，但ISFJ关注具体需求，INFJ关注深层意义。在歌词创作与粉丝互动中默契十足。",
  "INFJ-ISFJ": "{name1}（INFJ）与{name2}（ISFJ）是“双NFJ”关怀组合：都富有同理心，但ISFJ关注具体需求，INFJ关注深层意义。在歌词创作与粉丝互动中默契十足。",
  
  "ISFJ-INTJ": "{name1}（ISFJ）与{name2}（INTJ）是“温暖与冷静”的平衡：ISFJ照顾成员情绪，INTJ专注目标达成。若INTJ学会表达感谢，ISFJ学会直接沟通，关系将更健康。",
  "INTJ-ISFJ": "{name1}（INTJ）与{name2}（ISFJ）是“温暖与冷静”的平衡：ISFJ照顾成员情绪，INTJ专注目标达成。若INTJ学会表达感谢，ISFJ学会直接沟通，关系将更健康。",
  
  "ISFJ-ISTP": "{name1}（ISFJ）与{name2}（ISTP）是“关怀与独立”的试探：ISFJ想关心ISTP，ISTP却需要空间。只要ISFJ不强求亲密，ISTP偶尔回应善意，便能和平共处。",
  "ISTP-ISFJ": "{name1}（ISTP）与{name2}（ISFJ）是“关怀与独立”的试探：ISFJ想关心ISTP，ISTP却需要空间。只要ISFJ不强求亲密，ISTP偶尔回应善意，便能和平共处。",
  
  "ISFJ-ISFP": "{name1}（ISFJ）与{name2}（ISFP）是“双SFP”和谐组合：都温和、体贴、重视和谐。在乐队中营造出安全、支持的氛围，是新人最愿意加入的团队。",
  "ISFP-ISFJ": "{name1}（ISFP）与{name2}（ISFJ）是“双SFP”和谐组合：都温和、体贴、重视和谐。在乐队中营造出安全、支持的氛围，是新人最愿意加入的团队。",
  
  "ISFJ-INFP": "{name1}（ISFJ）与{name2}（INFP）是“服务与理想”的共鸣：ISFJ通过行动帮助他人，INFP通过作品传递理念。两者都内向敏感，需注意避免情绪积压。",
  "INFP-ISFJ": "{name1}（INFP）与{name2}（ISFJ）是“服务与理想”的共鸣：ISFJ通过行动帮助他人，INFP通过作品传递理念。两者都内向敏感，需注意避免情绪积压。",
  
  "ISFJ-INTP": "{name1}（ISFJ）与{name2}（INTP）是“情感与逻辑”的挑战：ISFJ重视人情，INTP重视真理。在决策时可能冲突，但若INTP尊重感受，ISFJ理解理性，可互补成长。",
  "INTP-ISFJ": "{name1}（INTP）与{name2}（ISFJ）是“情感与逻辑”的挑战：ISFJ重视人情，INTP重视真理。在决策时可能冲突，但若INTP尊重感受，ISFJ理解理性，可互补成长。",
  
  "ISFJ-ESTP": "{name1}（ISFJ）与{name2}（ESTP）是“谨慎与冒险”的反差萌：ISFJ担心ESTP太冲动，ESTP觉得ISFJ太保守。但在危机处理中，一个稳住后方，一个冲锋陷阵，效果奇佳。",
  "ESTP-ISFJ": "{name1}（ESTP）与{name2}（ISFJ）是“谨慎与冒险”的反差萌：ISFJ担心ESTP太冲动，ESTP觉得ISFJ太保守。但在危机处理中，一个稳住后方，一个冲锋陷阵，效果奇佳。",
  
  "ISFJ-ESFP": "{name1}（ISFJ）与{name2}（ESFP）是“支持者与表演者”的绝配：ESFP闪耀舞台，ISFJ默默准备道具、服装、茶水。彼此欣赏，各司其职。",
  "ESFP-ISFJ": "{name1}（ESFP）与{name2}（ISFJ）是“支持者与表演者”的绝配：ESFP闪耀舞台，ISFJ默默准备道具、服装、茶水。彼此欣赏，各司其职。",
  
  "ISFJ-ENFP": "{name1}（ISFJ）与{name2}（ENFP）是“稳定与创意”的融合：ENFP带来新点子，ISFJ确保细节到位。ENFP的热情能带动ISFJ走出舒适区，ISFJ的踏实让ENFP的梦落地。",
  "ENFP-ISFJ": "{name1}（ENFP）与{name2}（ISFJ）是“稳定与创意”的融合：ENFP带来新点子，ISFJ确保细节到位。ENFP的热情能带动ISFJ走出舒适区，ISFJ的踏实让ENFP的梦落地。",
  
  "ISFJ-ENTP": "{name1}（ISFJ）与{name2}（ENTP）是“传统与革新”的拉扯：ENTP总想打破规则，ISFJ希望维持秩序。若ENTP解释变革意义，ISFJ表达担忧原因，可找到中间道路。",
  "ENTP-ISFJ": "{name1}（ENTP）与{name2}（ISFJ）是“传统与革新”的拉扯：ENTP总想打破规则，ISFJ希望维持秩序。若ENTP解释变革意义，ISFJ表达担忧原因，可找到中间道路。",
  
  "ISFJ-ESTJ": "{name1}（ISFJ）与{name2}（ESTJ）是“SJ联盟”：都重视责任与和谐，但ESTJ更外向主导，ISFJ更内向支持。在组织演出、接待嘉宾时配合默契。",
  "ESTJ-ISFJ": "{name1}（ESTJ）与{name2}（ISFJ）是“SJ联盟”：都重视责任与和谐，但ESTJ更外向主导，ISFJ更内向支持。在组织演出、接待嘉宾时配合默契。",
  
  "ISFJ-ESFJ": "{name1}（ISFJ）与{name2}（ESFJ）是“双SFJ”关怀组合：都以他人为中心，善于营造温馨氛围。乐队如同一个大家庭，但需注意设立边界，避免过度付出。",
  "ESFJ-ISFJ": "{name1}（ESFJ）与{name2}（ISFJ）是“双SFJ”关怀组合：都以他人为中心，善于营造温馨氛围。乐队如同一个大家庭，但需注意设立边界，避免过度付出。",
  
  "ISFJ-ENFJ": "{name1}（ISFJ）与{name2}（ENFJ）是“支持者与领导者”的互补：ENFJ鼓舞人心，ISFJ落实关怀。ENFJ负责对外演讲，ISFJ照顾成员生活，相得益彰。",
  "ENFJ-ISFJ": "{name1}（ENFJ）与{name2}（ISFJ）是“支持者与领导者”的互补：ENFJ鼓舞人心，ISFJ落实关怀。ENFJ负责对外演讲，ISFJ照顾成员生活，相得益彰。",
  
  "ISFJ-ENTJ": "{name1}（ISFJ）与{name2}（ENTJ）是“温和与强势”的磨合：ENTJ目标导向，ISFJ人际导向。若ENTJ学会体恤，ISFJ学会直言，可构建既有效率又有人情味的团队。",
  "ENTJ-ISFJ": "{name1}（ENTJ）与{name2}（ISFJ）是“温和与强势”的磨合：ENTJ目标导向，ISFJ人际导向。若ENTJ学会体恤，ISFJ学会直言，可构建既有效率又有人情味的团队。",

  "INFJ-INTJ": "{name1}（INFJ）与{name2}（INTJ）是“双NJ”战略组合：都深思熟虑、目标远大。INFJ关注人本价值，INTJ关注系统效率。在乐队长期规划中极具前瞻性。",
  "INTJ-INFJ": "{name1}（INTJ）与{name2}（INFJ）是“双NJ”战略组合：都深思熟虑、目标远大。INFJ关注人本价值，INTJ关注系统效率。在乐队长期规划中极具前瞻性。",
  
  "INFJ-ISTP": "{name1}（INFJ）与{name2}（ISTP）是“理想与现实”的对话：INFJ谈论音乐的意义，ISTP调试音箱的参数。看似不在同一频道，但ISTP的实操能力能让INFJ的愿景成真。",
  "ISTP-INFJ": "{name1}（ISTP）与{name2}（INFJ）是“理想与现实”的对话：INFJ谈论音乐的意义，ISTP调试音箱的参数。看似不在同一频道，但ISTP的实操能力能让INFJ的愿景成真。",
  
  "INFJ-ISFP": "{name1}（INFJ）与{name2}（ISFP）是“深度与美感”的共鸣：INFJ挖掘情感内核，ISFP呈现艺术形式。在创作抒情歌曲时，两人合作的作品往往直击人心。",
  "ISFP-INFJ": "{name1}（ISFP）与{name2}（INFJ）是“深度与美感”的共鸣：INFJ挖掘情感内核，ISFP呈现艺术形式。在创作抒情歌曲时，两人合作的作品往往直击人心。",
  
  "INFJ-INFP": "{name1}（INFJ）与{name2}（INFP）是“双NFP”灵魂组合：都理想主义、富有同理心。INFJ更外向引导，INFP更内向沉浸。彼此理解无需多言，是创作上的天作之合。",
  "INFP-INFJ": "{name1}（INFP）与{name2}（INFJ）是“双NFP”灵魂组合：都理想主义、富有同理心。INFJ更外向引导，INFP更内向沉浸。彼此理解无需多言，是创作上的天作之合。",
  
  "INFJ-INTP": "{name1}（INFJ）与{name2}（INTP）是“人文与逻辑”的交融：INFJ从情感出发，INTP从原理出发。在探讨音乐理论或社会议题时，能激发出深刻而平衡的观点。",
  "INTP-INFJ": "{name1}（INTP）与{name2}（INFJ）是“人文与逻辑”的交融：INFJ从情感出发，INTP从原理出发。在探讨音乐理论或社会议题时，能激发出深刻而平衡的观点。",
  
  "INFJ-ESTP": "{name1}（INFJ）与{name2}（ESTP）是“哲思与行动”的反差：INFJ思考存在的意义，ESTP享受当下的狂欢。若ESTP尊重INFJ的深度，INFJ欣赏ESTP的活力，可互相拓展视野。",
  "ESTP-INFJ": "{name1}（ESTP）与{name2}（INFJ）是“哲思与行动”的反差：INFJ思考存在的意义，ESTP享受当下的狂欢。若ESTP尊重INFJ的深度，INFJ欣赏ESTP的活力，可互相拓展视野。",
  
  "INFJ-ESFP": "{name1}（INFJ）与{name2}（ESFP）是“内省与外放”的互补：ESFP带来欢乐与人气，INFJ赋予演出深度与内涵。一个吸引观众，一个留住观众。",
  "ESFP-INFJ": "{name1}（ESFP）与{name2}（INFJ）是“内省与外放”的互补：ESFP带来欢乐与人气，INFJ赋予演出深度与内涵。一个吸引观众，一个留住观众。",
  
  "INFJ-ENFP": "{name1}（INFJ）与{name2}（ENFP）是“双NF”热情组合：都富有创意与同理心。INFJ更聚焦，ENFP更发散。合作时需设定主题，否则容易陷入无限脑暴。",
  "ENFP-INFJ": "{name1}（ENFP）与{name2}（INFJ）是“双NF”热情组合：都富有创意与同理心。INFJ更聚焦，ENFP更发散。合作时需设定主题，否则容易陷入无限脑暴。",
  
  "INFJ-ENTP": "{name1}（INFJ）与{name2}（ENTP）是“价值与可能性”的探索：ENTP提出无数方案，INFJ筛选符合价值观的方向。只要ENTP不戏谑INFJ的信念，INFJ不否定ENTP的创意，便是绝佳搭档。",
  "ENTP-INFJ": "{name1}（ENTP）与{name2}（INFJ）是“价值与可能性”的探索：ENTP提出无数方案，INFJ筛选符合价值观的方向。只要ENTP不戏谑INFJ的信念，INFJ不否定ENTP的创意，便是绝佳搭档。",
  
  "INFJ-ESTJ": "{name1}（INFJ）与{name2}（ESTJ）是“愿景与执行”的磨合：ESTJ关注“怎么做”，INFJ关注“为什么做”。若ESTJ理解INFJ的使命感，INFJ认可ESTJ的效率，可实现理想落地。",
  "ESTJ-INFJ": "{name1}（ESTJ）与{name2}（INFJ）是“愿景与执行”的磨合：ESTJ关注“怎么做”，INFJ关注“为什么做”。若ESTJ理解INFJ的使命感，INFJ认可ESTJ的效率，可实现理想落地。",
  
  "INFJ-ESFJ": "{name1}（INFJ）与{name2}（ESFJ）是“深度关怀与广泛关怀”的结合：ESFJ照顾每个人的情绪，INFJ洞察群体的潜意识。在粉丝运营与社区建设中极具优势。",
  "ESFJ-INFJ": "{name1}（ESFJ）与{name2}（INFJ）是“深度关怀与广泛关怀”的结合：ESFJ照顾每个人的情绪，INFJ洞察群体的潜意识。在粉丝运营与社区建设中极具优势。",
  
  "INFJ-ENFJ": "{name1}（INFJ）与{name2}（ENFJ）是“双NFJ”领导组合：都擅长激励他人，但INFJ更内敛策略，ENFJ更外向鼓舞。一个制定文化，一个传播文化，相辅相成。",
  "ENFJ-INFJ": "{name1}（ENFJ）与{name2}（INFJ）是“双NFJ”领导组合：都擅长激励他人，但INFJ更内敛策略，ENFJ更外向鼓舞。一个制定文化，一个传播文化，相辅相成。",
  
  "INFJ-ENTJ": "{name1}（INFJ）与{name2}（ENTJ）是“人本与目标”的平衡：ENTJ推动乐队前进，INFJ确保不迷失初心。若ENTJ倾听INFJ的警示，INFJ支持ENTJ的决策，乐队将既成功又有灵魂。",
  "ENTJ-INFJ": "{name1}（ENTJ）与{name2}（INFJ）是“人本与目标”的平衡：ENTJ推动乐队前进，INFJ确保不迷失初心。若ENTJ倾听INFJ的警示，INFJ支持ENTJ的决策，乐队将既成功又有灵魂。",

  "INTJ-ISTP": "{name1}（INTJ）与{name2}（ISTP）是“战略家与工匠”的合作：INTJ设计系统，ISTP优化细节。在录音室或设备搭建中，一个规划架构，一个动手实现，效率极高。",
  "ISTP-INTJ": "{name1}（ISTP）与{name2}（INTJ）是“战略家与工匠”的合作：INTJ设计系统，ISTP优化细节。在录音室或设备搭建中，一个规划架构，一个动手实现，效率极高。",
  
  "INTJ-ISFP": "{name1}（INTJ）与{name2}（ISFP）是“逻辑与美学”的碰撞：INTJ分析和弦进行，ISFP感受旋律流动。若INTJ不贬低感性，ISFP不抗拒分析，可创作出既有结构又有灵魂的作品。",
  "ISFP-INTJ": "{name1}（ISFP）与{name2}（INTJ）是“逻辑与美学”的碰撞：INTJ分析和弦进行，ISFP感受旋律流动。若INTJ不贬低感性，ISFP不抗拒分析，可创作出既有结构又有灵魂的作品。",
  
  "INTJ-INFP": "{name1}（INTJ）与{name2}（INFP）是“理性与理想”的张力：INTJ追求效率，INFP追求真实。在创作方向上可能分歧，但若INTJ尊重INFP的价值观，INFP理解INTJ的逻辑，可达成深度合作。",
  "INFP-INTJ": "{name1}（INFP）与{name2}（INTJ）是“理性与理想”的张力：INTJ追求效率，INFP追求真实。在创作方向上可能分歧，但若INTJ尊重INFP的价值观，INFP理解INTJ的逻辑，可达成深度合作。",
  
  "INTJ-INTP": "{name1}（INTJ）与{name2}（INTP）是“双NT”思想组合：都热爱抽象思考，但INTJ目标导向，INTP好奇驱动。在音乐理论研究或技术创新上，能迸发惊人火花。",
  "INTP-INTJ": "{name1}（INTP）与{name2}（INTJ）是“双NT”思想组合：都热爱抽象思考，但INTJ目标导向，INTP好奇驱动。在音乐理论研究或技术创新上，能迸发惊人火花。",
  
  "INTJ-ESTP": "{name1}（INTJ）与{name2}（ESTP）是“长远与当下”的拉锯：INTJ规划三年计划，ESTP只想今晚嗨翻。若ESTP参与战略讨论，INTJ允许即兴发挥，可兼顾未来与现在。",
  "ESTP-INTJ": "{name1}（ESTP）与{name2}（INTJ）是“长远与当下”的拉锯：INTJ规划三年计划，ESTP只想今晚嗨翻。若ESTP参与战略讨论，INTJ允许即兴发挥，可兼顾未来与现在。",
  
  "INTJ-ESFP": "{name1}（INTJ）与{name2}（ESFP）是“冷静与热情”的反差：ESFP用表演感染观众，INTJ用数据优化演出。一个在台前发光，一个在幕后运筹，各司其职。",
  "ESFP-INTJ": "{name1}（ESFP）与{name2}（INTJ）是“冷静与热情”的反差：ESFP用表演感染观众，INTJ用数据优化演出。一个在台前发光，一个在幕后运筹，各司其职。",
  
  "INTJ-ENFP": "{name1}（INTJ）与{name2}（ENFP）是“结构与灵感”的互补：ENFP提供创意源泉，INTJ搭建实现框架。只要ENFP不嫌INTJ太严苛，INTJ不嫌ENFP太散漫，便是创新引擎。",
  "ENFP-INTJ": "{name1}（ENFP）与{name2}（INTJ）是“结构与灵感”的互补：ENFP提供创意源泉，INTJ搭建实现框架。只要ENFP不嫌INTJ太严苛，INTJ不嫌ENFP太散漫，便是创新引擎。",
  
  "INTJ-ENTP": "{name1}（INTJ）与{name2}（ENTP）是“战略与战术”的协同：ENTP不断测试新方法，INTJ整合最优路径。在快速变化的音乐市场中，这种组合极具适应力。",
  "ENTP-INTJ": "{name1}（ENTP）与{name2}（INTJ）是“战略与战术”的协同：ENTP不断测试新方法，INTJ整合最优路径。在快速变化的音乐市场中，这种组合极具适应力。",
  
  "INTJ-ESTJ": "{name1}（INTJ）与{name2}（ESTJ）是“双TJ”高效组合：都果断、有条理。ESTJ擅长日常管理，INTJ擅长长远布局。是乐队商业化的强力推手，但需注意人文关怀。",
  "ESTJ-INTJ": "{name1}（ESTJ）与{name2}（INTJ）是“双TJ”高效组合：都果断、有条理。ESTJ擅长日常管理，INTJ擅长长远布局。是乐队商业化的强力推手，但需注意人文关怀。",
  
  "INTJ-ESFJ": "{name1}（INTJ）与{name2}（ESFJ）是“目标与和谐”的调和：ESFJ维护团队氛围，INTJ推动目标达成。若INTJ学会赞美，ESFJ学会接受批评，关系将更稳固。",
  "ESFJ-INTJ": "{name1}（ESFJ）与{name2}（INTJ）是“目标与和谐”的调和：ESFJ维护团队氛围，INTJ推动目标达成。若INTJ学会赞美，ESFJ学会接受批评，关系将更稳固。",
  "INTJ-ENFJ": "{name1}（INTJ）与{name2}（ENFJ）是“理性与感召”的结合：ENFJ凝聚人心，INTJ制定战略。一个赢得人心，一个赢得市场，是乐队扩张的理想核心。",
  "ENFJ-INTJ": "{name1}（ENFJ）与{name2}（INTJ）是“理性与感召”的结合：ENFJ凝聚人心，INTJ制定战略。一个赢得人心，一个赢得市场，是乐队扩张的理想核心。",
  "INTJ-ENTJ": "{name1}（INTJ）与{name2}（ENTJ）是“双NTJ”指挥官组合：都自信、有远见。INTJ更独立深思，ENTJ更外向统筹。若明确主次，可打造一支所向披靡的乐队。",
  "ENTJ-INTJ": "{name1}（ENTJ）与{name2}（INTJ）是“双NTJ”指挥官组合：都自信、有远见。INTJ更独立深思，ENTJ更外向统筹。若明确主次，可打造一支所向披靡的乐队。",

  "ISTP-ISFP": "{name1}（ISTP）与{name2}（ISFP）是“双SP”自由组合：都活在当下、重视体验。ISTP精于技术，ISFP敏于美感。在即兴演奏或实验音乐中配合得天衣无缝。",
  "ISFP-ISTP": "{name1}（ISFP）与{name2}（ISTP）是“双SP”自由组合：都活在当下、重视体验。ISTP精于技术，ISFP敏于美感。在即兴演奏或实验音乐中配合得天衣无缝。",
  "ISTP-INFP": "{name1}（ISTP）与{name2}（INFP）是“行动与沉思”的互补：ISTP用乐器说话，INFP用歌词倾诉。一个外放技巧，一个内敛情感，共同构成完整的音乐表达。",
  "INFP-ISTP": "{name1}（INFP）与{name2}（ISTP）是“行动与沉思”的互补：ISTP用乐器说话，INFP用歌词倾诉。一个外放技巧，一个内敛情感，共同构成完整的音乐表达。",
  "ISTP-INTP": "{name1}（ISTP）与{name2}（INTP）是“实践与理论”的双子星：ISTP动手调试设备，INTP研究声学原理。在技术开发或音色设计上，是无可替代的搭档。",
  "INTP-ISTP": "{name1}（INTP）与{name2}（ISTP）是“实践与理论”的双子星：ISTP动手调试设备，INTP研究声学原理。在技术开发或音色设计上，是无可替代的搭档。",
  "ISTP-ESTP": "{name1}（ISTP）与{name2}（ESTP）是“双STP”冒险组合：都热爱刺激、适应力强。ESTP主导社交，ISTP专注操作。在巡演路上，一个搞定场地，一个修好器材。",
  "ESTP-ISTP": "{name1}（ESTP）与{name2}（ISTP）是“双STP”冒险组合：都热爱刺激、适应力强。ESTP主导社交，ISTP专注操作。在巡演路上，一个搞定场地，一个修好器材。",
  "ISTP-ESFP": "{name1}（ISTP）与{name2}（ESFP）是“冷静与热情”的平衡：ESFP带动气氛，ISTP确保设备稳定。一个在聚光灯下闪耀，一个在阴影中守护，缺一不可。",
  "ESFP-ISTP": "{name1}（ESFP）与{name2}（ISTP）是“冷静与热情”的平衡：ESFP带动气氛，ISTP确保设备稳定。一个在聚光灯下闪耀，一个在阴影中守护，缺一不可。",
  "ISTP-ENFP": "{name1}（ISTP）与{name2}（ENFP）是“务实与梦想”的融合：ENFP提出“去沙漠办音乐会”，ISTP计算可行性并准备装备。只要ENFP不嫌ISTP太慢，ISTP不嫌ENFP太疯，便是完美探险队。",
  "ENFP-ISTP": "{name1}（ENFP）与{name2}（ISTP）是“务实与梦想”的融合：ENFP提出“去沙漠办音乐会”，ISTP计算可行性并准备装备。只要ENFP不嫌ISTP太慢，ISTP不嫌ENFP太疯，便是完美探险队。",
  "ISTP-ENTP": "{name1}（ISTP）与{name2}（ENTP）是“动手与动脑”的绝配：ENTP构想新玩法，ISTP将其变为现实。在开发新乐器或演出形式时，创意与执行力兼备。",
  "ENTP-ISTP": "{name1}（ENTP）与{name2}（ISTP）是“动手与动脑”的绝配：ENTP构想新玩法，ISTP将其变为现实。在开发新乐器或演出形式时，创意与执行力兼备。",
  "ISTP-ESTJ": "{name1}（ISTP）与{name2}（ESTJ）是“灵活与规范”的磨合：ESTJ制定流程，ISTP寻找捷径。若ESTJ允许ISTP的变通，ISTP尊重ESTJ的规则，可在效率与创新间取得平衡。",
  "ESTJ-ISTP": "{name1}（ESTJ）与{name2}（ISTP）是“灵活与规范”的磨合：ESTJ制定流程，ISTP寻找捷径。若ESTJ允许ISTP的变通，ISTP尊重ESTJ的规则，可在效率与创新间取得平衡。",
  "ISTP-ESFJ": "{name1}（ISTP）与{name2}（ESFJ）是“独立与关怀”的试探：ESFJ想融入ISTP，ISTP需要独处。只要ESFJ不强求，ISTP偶尔回应，便能维持友好合作关系。",
  "ESFJ-ISTP": "{name1}（ESFJ）与{name2}（ISTP）是“独立与关怀”的试探：ESFJ想融入ISTP，ISTP需要独处。只要ESFJ不强求，ISTP偶尔回应，便能维持友好合作关系。",
  "ISTP-ENFJ": "{name1}（ISTP）与{name2}（ENFJ）是“沉默与鼓舞”的互动：ENFJ试图激励ISTP，ISTP用行动证明自己。若ENFJ给予空间，ISTP展示成果，彼此会建立深厚信任。",
  "ENFJ-ISTP": "{name1}（ENFJ）与{name2}（ISTP）是“沉默与鼓舞”的互动：ENFJ试图激励ISTP，ISTP用行动证明自己。若ENFJ给予空间，ISTP展示成果，彼此会建立深厚信任。",
  "ISTP-ENTJ": "{name1}（ISTP）与{name2}（ENTJ）是“执行与指挥”的配合：ENTJ下达指令，ISTP高效完成。只要ENTJ不 micromanage，ISTP不消极抵抗，便是高效的上下级关系。",
  "ENTJ-ISTP": "{name1}（ENTJ）与{name2}（ISTP）是“执行与指挥”的配合：ENTJ下达指令，ISTP高效完成。只要ENTJ不 micromanage，ISTP不消极抵抗，便是高效的上下级关系。",

  "ISFP-INFP": "{name1}（ISFP）与{name2}（INFP）是“双IFP”艺术家组合：都忠于内心、追求美与真实。ISFP通过旋律表达，INFP通过歌词诉说。合作的作品充满真诚与感染力。",
  "INFP-ISFP": "{name1}（INFP）与{name2}（ISFP）是“双IFP”艺术家组合：都忠于内心、追求美与真实。ISFP通过旋律表达，INFP通过歌词诉说。合作的作品充满真诚与感染力。",
  "ISFP-INTP": "{name1}（ISFP）与{name2}（INTP）是“感性与理性”的对话：ISFP凭直觉创作，INTP分析创作原理。若INTP不破坏ISFP的灵感流，ISFP不排斥INTP的建议，可提升作品深度。",
  "INTP-ISFP": "{name1}（INTP）与{name2}（ISFP）是“感性与理性”的对话：ISFP凭直觉创作，INTP分析创作原理。若INTP不破坏ISFP的灵感流，ISFP不排斥INTP的建议，可提升作品深度。",
  "ISFP-ESTP": "{name1}（ISFP）与{name2}（ESTP）是“内敛与外放”的互补：ESTP带动现场，ISFP注入情感。一个让观众站起来，一个让观众哭出来，演出层次丰富。",
  "ESTP-ISFP": "{name1}（ESTP）与{name2}（ISFP）是“内敛与外放”的互补：ESTP带动现场，ISFP注入情感。一个让观众站起来，一个让观众哭出来，演出层次丰富。",
  "ISFP-ESFP": "{name1}（ISFP）与{name2}（ESFP）是“双SFP”表演组合：都重视体验与美感。ESFP更外向互动，ISFP更内向沉浸。在舞台上形成动静结合的独特魅力。",
  "ESFP-ISFP": "{name1}（ESFP）与{name2}（ISFP）是“双SFP”表演组合：都重视体验与美感。ESFP更外向互动，ISFP更内向沉浸。在舞台上形成动静结合的独特魅力。",
  "ISFP-ENFP": "{name1}（ISFP）与{name2}（ENFP）是“专注与发散”的融合：ENFP带来多元灵感，ISFP将其凝练成精品。只要ENFP不分散ISFP注意力，ISFP不拒绝ENFP的热情，便是创意源泉。",
  "ENFP-ISFP": "{name1}（ENFP）与{name2}（ISFP）是“专注与发散”的融合：ENFP带来多元灵感，ISFP将其凝练成精品。只要ENFP不分散ISFP注意力，ISFP不拒绝ENFP的热情，便是创意源泉。",
  "ISFP-ENTP": "{name1}（ISFP）与{name2}（ENTP）是“美感与创意”的碰撞：ENTP不断尝试新风格，ISFP坚守审美标准。若ENTP尊重ISFP的品味，ISFP开放接受新事物，可拓展音乐边界。",
  "ENTP-ISFP": "{name1}（ENTP）与{name2}（ISFP）是“美感与创意”的碰撞：ENTP不断尝试新风格，ISFP坚守审美标准。若ENTP尊重ISFP的品味，ISFP开放接受新事物，可拓展音乐边界。",
  "ISFP-ESTJ": "{name1}（ISFP）与{name2}（ESTJ）是“自由与责任”的调和：ESTJ确保乐队运转，ISFP贡献艺术灵魂。若ESTJ不压制ISFP的个性，ISFP理解ESTJ的压力，可维持平衡。",
  "ESTJ-ISFP": "{name1}（ESTJ）与{name2}（ISFP）是“自由与责任”的调和：ESTJ确保乐队运转，ISFP贡献艺术灵魂。若ESTJ不压制ISFP的个性，ISFP理解ESTJ的压力，可维持平衡。",
  "ISFP-ESFJ": "{name1}（ISFP）与{name2}（ESFJ）是“温柔与关怀”的共鸣：都体贴、善解人意。ESFJ照顾团队关系，ISFP用音乐抚慰人心。是乐队中最治愈的存在。",
  "ESFJ-ISFP": "{name1}（ESFJ）与{name2}（ISFP）是“温柔与关怀”的共鸣：都体贴、善解人意。ESFJ照顾团队关系，ISFP用音乐抚慰人心。是乐队中最治愈的存在。",
  "ISFP-ENFJ": "{name1}（ISFP）与{name2}（ENFJ）是“内向艺术家与外向引导者”的互补：ENFJ鼓励ISFP展示才华，ISFP用作品回报信任。彼此成就，共同成长。",
  "ENFJ-ISFP": "{name1}（ENFJ）与{name2}（ISFP）是“内向艺术家与外向引导者”的互补：ENFJ鼓励ISFP展示才华，ISFP用作品回报信任。彼此成就，共同成长。",
  "ISFP-ENTJ": "{name1}（ISFP）与{name2}（ENTJ）是“感性与目标”的磨合：ENTJ推动乐队商业化，ISFP担忧艺术纯粹性。若ENTJ保护ISFP的创作自由，ISFP支持合理商业决策，可双赢。",
  "ENTJ-ISFP": "{name1}（ENTJ）与{name2}（ISFP）是“感性与目标”的磨合：ENTJ推动乐队商业化，ISFP担忧艺术纯粹性。若ENTJ保护ISFP的创作自由，ISFP支持合理商业决策，可双赢。",

  "INFP-INTP": "{name1}（INFP）与{name2}（INTP）是“双NTP”思想组合：都内向、爱思考。INFP关注人文价值，INTP关注逻辑系统。在创作具有哲学深度的歌曲时，合作无间。",
  "INTP-INFP": "{name1}（INTP）与{name2}（INFP）是“双NTP”思想组合：都内向、爱思考。INFP关注人文价值，INTP关注逻辑系统。在创作具有哲学深度的歌曲时，合作无间。",
  "INFP-ESTP": "{name1}（INFP）与{name2}（ESTP）是“梦想与现实”的反差：INFP写诗，ESTP冲浪。看似格格不入，但ESTP的活力能带动INFP走出孤独，INFP的深度能让ESTP思考人生。",
  "ESTP-INFP": "{name1}（ESTP）与{name2}（INFP）是“梦想与现实”的反差：INFP写诗，ESTP冲浪。看似格格不入，但ESTP的活力能带动INFP走出孤独，INFP的深度能让ESTP思考人生。",
  "INFP-ESFP": "{name1}（INFP）与{name2}（ESFP）是“内省与外放”的互补：ESFP享受聚光灯，INFP沉浸创作。一个吸引观众，一个提供内容，是内容与流量的完美结合。",
  "ESFP-INFP": "{name1}（ESFP）与{name2}（INFP）是“内省与外放”的互补：ESFP享受聚光灯，INFP沉浸创作。一个吸引观众，一个提供内容，是内容与流量的完美结合。",
  "INFP-ENFP": "{name1}（INFP）与{name2}（ENFP）是“双NFP”理想组合：都富有同理心与创造力。INFP更内敛专注，ENFP更外向发散。合作时需一人主导，避免方向模糊。",
  "ENFP-INFP": "{name1}（ENFP）与{name2}（INFP）是“双NFP”理想组合：都富有同理心与创造力。INFP更内敛专注，ENFP更外向发散。合作时需一人主导，避免方向模糊。",
  "INFP-ENTP": "{name1}（INFP）与{name2}（ENTP）是“价值与创意”的探索：ENTP提出无数点子，INFP筛选符合内心价值的方向。只要ENTP不戏谑INFP的信念，INFP不否定ENTP的幽默，便是绝佳搭档。",
  "ENTP-INFP": "{name1}（ENTP）与{name2}（INFP）是“价值与创意”的探索：ENTP提出无数点子，INFP筛选符合内心价值的方向。只要ENTP不戏谑INFP的信念，INFP不否定ENTP的幽默，便是绝佳搭档。",
  "INFP-ESTJ": "{name1}（INFP）与{name2}（ESTJ）是“理想与现实”的磨合：ESTJ关注实际成果，INFP关注内在意义。若ESTJ理解INFP的使命感，INFP认可ESTJ的务实，可实现理想落地。",
  "ESTJ-INFP": "{name1}（ESTJ）与{name2}（INFP）是“理想与现实”的磨合：ESTJ关注实际成果，INFP关注内在意义。若ESTJ理解INFP的使命感，INFP认可ESTJ的务实，可实现理想落地。",
  "INFP-ESFJ": "{name1}（INFP）与{name2}（ESFJ）是“深度关怀与广泛关怀”的结合：ESFJ照顾每个人的情绪，INFP洞察群体的潜意识。在粉丝运营与社区建设中极具优势。",
  "ESFJ-INFP": "{name1}（ESFJ）与{name2}（INFP）是“深度关怀与广泛关怀”的结合：ESFJ照顾每个人的情绪，INFP洞察群体的潜意识。在粉丝运营与社区建设中极具优势。",
  "INFP-ENFJ": "{name1}（INFP）与{name2}（ENFJ）是“内向梦想家与外向引导者”的互补：ENFJ帮助INFP连接世界，INFP为ENFJ提供深度内容。彼此成就，共同成长。",
  "ENFJ-INFP": "{name1}（ENFJ）与{name2}（INFP）是“内向梦想家与外向引导者”的互补：ENFJ帮助INFP连接世界，INFP为ENFJ提供深度内容。彼此成就，共同成长。",
  "INFP-ENTJ": "{name1}（INFP）与{name2}（ENTJ）是“人本与目标”的平衡：ENTJ推动乐队前进，INFP确保不迷失初心。若ENTJ倾听INFP的警示，INFP支持ENTJ的决策，乐队将既成功又有灵魂。",
  "ENTJ-INFP": "{name1}（ENTJ）与{name2}（INFP）是“人本与目标”的平衡：ENTJ推动乐队前进，INFP确保不迷失初心。若ENTJ倾听INFP的警示，INFP支持ENTJ的决策，乐队将既成功又有灵魂。",

  "INTP-ESTP": "{name1}（INTP）与{name2}（ESTP）是“理论与实践”的结合：INTP构想新系统，ESTP立即测试。在开发新演出形式或互动技术时，一个设计，一个执行，效率极高。",
  "ESTP-INTP": "{name1}（ESTP）与{name2}（INTP）是“理论与实践”的结合：INTP构想新系统，ESTP立即测试。在开发新演出形式或互动技术时，一个设计，一个执行，效率极高。",
  "INTP-ESFP": "{name1}（INTP）与{name2}（ESFP）是“逻辑与热情”的反差：ESFP用表演感染观众，INTP用数据优化体验。一个创造情感连接，一个提升技术细节，相辅相成。",
  "ESFP-INTP": "{name1}（ESFP）与{name2}（INTP）是“逻辑与热情”的反差：ESFP用表演感染观众，INTP用数据优化体验。一个创造情感连接，一个提升技术细节，相辅相成。",
  "INTP-ENFP": "{name1}（INTP）与{name2}（ENFP）是“分析与创意”的互补：ENFP提供灵感，INTP提供框架。只要ENFP不嫌INTP太较真，INTP不嫌ENFP太跳跃，便是创新引擎。",
  "ENFP-INTP": "{name1}（ENFP）与{name2}（INTP）是“分析与创意”的互补：ENFP提供灵感，INTP提供框架。只要ENFP不嫌INTP太较真，INTP不嫌ENFP太跳跃，便是创新引擎。",
  "INTP-ENTP": "{name1}（INTP）与{name2}（ENTP）是“双NTP”思想组合：都热爱抽象思考与辩论。INTP更内向深入，ENTP更外向发散。在头脑风暴中能激发出惊人创意，但需落地执行者跟进。",
  "ENTP-INTP": "{name1}（ENTP）与{name2}（INTP）是“双NTP”思想组合：都热爱抽象思考与辩论。INTP更内向深入，ENTP更外向发散。在头脑风暴中能激发出惊人创意，但需落地执行者跟进。",
  "INTP-ESTJ": "{name1}（INTP）与{name2}（ESTJ）是“理论与实践”的磨合：ESTJ关注“怎么做”，INTP关注“为什么做”。若ESTJ允许INTP探索原理，INTP尊重ESTJ的效率，可实现创新与落地的平衡。",
  "ESTJ-INTP": "{name1}（ESTJ）与{name2}（INTP）是“理论与实践”的磨合：ESTJ关注“怎么做”，INTP关注“为什么做”。若ESTJ允许INTP探索原理，INTP尊重ESTJ的效率，可实现创新与落地的平衡。",
  "INTP-ESFJ": "{name1}（INTP）与{name2}（ESFJ）是“逻辑与情感”的挑战：ESFJ重视人际和谐，INTP重视客观真理。在决策时可能冲突，但若INTP学会委婉表达，ESFJ理解理性价值，可互补成长。",
  "ESFJ-INTP": "{name1}（ESFJ）与{name2}（INTP）是“逻辑与情感”的挑战：ESFJ重视人际和谐，INTP重视客观真理。在决策时可能冲突，但若INTP学会委婉表达，ESFJ理解理性价值，可互补成长。",
  "INTP-ENFJ": "{name1}（INTP）与{name2}（ENFJ）是“理性与感召”的结合：ENFJ凝聚人心，INTP提供深度见解。一个赢得信任，一个提供智慧，是乐队智囊团的核心。",
  "ENFJ-INTP": "{name1}（ENFJ）与{name2}（INTP）是“理性与感召”的结合：ENFJ凝聚人心，INTP提供深度见解。一个赢得信任，一个提供智慧，是乐队智囊团的核心。",
  "INTP-ENTJ": "{name1}（INTP）与{name2}（ENTJ）是“创意与战略”的协同：INTP提供颠覆性想法，ENTJ将其纳入战略规划。只要ENTJ给予INTP足够自由，INTP支持ENTJ的愿景，便是创新引擎。",
  "ENTJ-INTP": "{name1}（ENTJ）与{name2}（INTP）是“创意与战略”的协同：INTP提供颠覆性想法，ENTJ将其纳入战略规划。只要ENTJ给予INTP足够自由，INTP支持ENTJ的愿景，便是创新引擎。",

  "ESTP-ESFP": "{name1}（ESTP）与{name2}（ESFP）是“双STP”活力组合：都外向、爱玩、适应力强。ESTP更爱冒险，ESFP更爱表演。在舞台上制造无限惊喜，是观众的宠儿。",
  "ESFP-ESTP": "{name1}（ESFP）与{name2}（ESTP）是“双STP”活力组合：都外向、爱玩、适应力强。ESTP更爱冒险，ESFP更爱表演。在舞台上制造无限惊喜，是观众的宠儿。",
  "ESTP-ENFP": "{name1}（ESTP）与{name2}（ENFP）是“行动与创意”的融合：ENFP提出新点子，ESTP立即执行。一个想到就做，一个做了再想，合作充满能量与乐趣。",
  "ENFP-ESTP": "{name1}（ENFP）与{name2}（ESTP）是“行动与创意”的融合：ENFP提出新点子，ESTP立即执行。一个想到就做，一个做了再想，合作充满能量与乐趣。",
  "ESTP-ENTP": "{name1}（ESTP）与{name2}（ENTP）是“双ETP”冒险组合：都灵活、机智、喜欢挑战。ESTP更重实操，ENTP更重概念。在应对突发状况或开拓新市场时，配合默契。",
  "ENTP-ESTP": "{name1}（ENTP）与{name2}（ESTP）是“双ETP”冒险组合：都灵活、机智、喜欢挑战。ESTP更重实操，ENTP更重概念。在应对突发状况或开拓新市场时，配合默契。",
  "ESTP-ESTJ": "{name1}（ESTP）与{name2}（ESTJ）是“灵活与规范”的磨合：ESTJ制定计划，ESTP随机应变。若ESTJ允许ESTP的变通，ESTP尊重ESTJ的框架，可在稳定与创新间取得平衡。",
  "ESTJ-ESTP": "{name1}（ESTJ）与{name2}（ESTP）是“灵活与规范”的磨合：ESTJ制定计划，ESTP随机应变。若ESTJ允许ESTP的变通，ESTP尊重ESTJ的框架，可在稳定与创新间取得平衡。",
  "ESTP-ESFJ": "{name1}（ESTP）与{name2}（ESFJ）是“活力与关怀”的互补：ESFJ照顾团队氛围，ESTP带来刺激体验。一个维系内部和谐，一个拓展外部机会，相得益彰。",
  "ESFJ-ESTP": "{name1}（ESFJ）与{name2}（ESTP）是“活力与关怀”的互补：ESFJ照顾团队氛围，ESTP带来刺激体验。一个维系内部和谐，一个拓展外部机会，相得益彰。",
  "ESTP-ENFJ": "{name1}（ESTP）与{name2}（ENFJ）是“行动与鼓舞”的结合：ENFJ激励团队，ESTP带头冲锋。一个提供动力，一个付诸行动，是推动乐队前进的双引擎。",
  "ENFJ-ESTP": "{name1}（ENFJ）与{name2}（ESTP）是“行动与鼓舞”的结合：ENFJ激励团队，ESTP带头冲锋。一个提供动力，一个付诸行动，是推动乐队前进的双引擎。",
  "ESTP-ENTJ": "{name1}（ESTP）与{name2}（ENTJ）是“执行与指挥”的配合：ENTJ制定战略，ESTP高效执行。只要ENTJ给予ESTP足够自主权，ESTP不偏离目标，便是高效的上下级关系。",
  "ENTJ-ESTP": "{name1}（ENTJ）与{name2}（ESTP）是“执行与指挥”的配合：ENTJ制定战略，ESTP高效执行。只要ENTJ给予ESTP足够自主权，ESTP不偏离目标，便是高效的上下级关系。",

  "ESFP-ENFP": "{name1}（ESFP）与{name2}（ENFP）是“双EFP”热情组合：都外向、富有感染力。ESFP更重当下体验，ENFP更重未来可能。在舞台表演与粉丝互动中极具魅力。",
  "ENFP-ESFP": "{name1}（ENFP）与{name2}（ESFP）是“双EFP”热情组合：都外向、富有感染力。ESFP更重当下体验，ENFP更重未来可能。在舞台表演与粉丝互动中极具魅力。",
  "ESFP-ENTP": "{name1}（ESFP）与{name2}（ENTP）是“表演与创意”的碰撞：ENTP不断尝试新风格，ESFP用舞台魅力呈现。只要ENTP不破坏ESFP的节奏，ESFP开放接受新事物，可拓展音乐边界。",
  "ENTP-ESFP": "{name1}（ENTP）与{name2}（ESFP）是“表演与创意”的碰撞：ENTP不断尝试新风格，ESFP用舞台魅力呈现。只要ENTP不破坏ESFP的节奏，ESFP开放接受新事物，可拓展音乐边界。",
  "ESFP-ESTJ": "{name1}（ESFP）与{name2}（ESTJ）是“自由与责任”的调和：ESTJ确保乐队运转，ESFP贡献舞台魅力。若ESTJ不压制ESFP的个性，ESFP理解ESTJ的压力，可维持平衡。",
  "ESTJ-ESFP": "{name1}（ESTJ）与{name2}（ESFP）是“自由与责任”的调和：ESTJ确保乐队运转，ESFP贡献舞台魅力。若ESTJ不压制ESFP的个性，ESFP理解ESTJ的压力，可维持平衡。",
  "ESFP-ESFJ": "{name1}（ESFP）与{name2}（ESFJ）是“双SFP”关怀组合：都重视和谐与体验。ESFP闪耀舞台，ESFJ照顾后台。一个吸引观众，一个维系团队，是完美的内外搭档。",
  "ESFJ-ESFP": "{name1}（ESFJ）与{name2}（ESFP）是“双SFP”关怀组合：都重视和谐与体验。ESFP闪耀舞台，ESFJ照顾后台。一个吸引观众，一个维系团队，是完美的内外搭档。",
  "ESFP-ENFJ": "{name1}（ESFP）与{name2}（ENFJ）是“表演者与引导者”的互补：ENFJ凝聚人心，ESFP点燃现场。一个赢得信任，一个赢得欢呼，是乐队扩张的理想核心。",
  "ENFJ-ESFP": "{name1}（ENFJ）与{name2}（ESFP）是“表演者与引导者”的互补：ENFJ凝聚人心，ESFP点燃现场。一个赢得信任，一个赢得欢呼，是乐队扩张的理想核心。",
  "ESFP-ENTJ": "{name1}（ESFP）与{name2}（ENTJ）是“魅力与目标”的结合：ENTJ推动乐队前进，ESFP用表演吸引资源。只要ENTJ保护ESFP的创作自由，ESFP支持合理商业决策，可双赢。",
  "ENTJ-ESFP": "{name1}（ENTJ）与{name2}（ESFP）是“魅力与目标”的结合：ENTJ推动乐队前进，ESFP用表演吸引资源。只要ENTJ保护ESFP的创作自由，ESFP支持合理商业决策，可双赢。",

  "ENFP-ENTP": "{name1}（ENFP）与{name2}（ENTP）是“双ENP”创意组合：都外向、富有想象力。ENFP更重人文关怀，ENTP更重逻辑挑战。在头脑风暴中能激发出无限可能，但需落地执行者跟进。",
  "ENTP-ENFP": "{name1}（ENTP）与{name2}（ENFP）是“双ENP”创意组合：都外向、富有想象力。ENFP更重人文关怀，ENTP更重逻辑挑战。在头脑风暴中能激发出无限可能，但需落地执行者跟进。",
  "ENFP-ESTJ": "{name1}（ENFP）与{name2}（ESTJ）是“创意与执行”的磨合：ESTJ关注实际成果，ENFP关注潜在可能。若ESTJ允许ENFP探索，ENFP尊重ESTJ的效率，可实现创新与落地的平衡。",
  "ESTJ-ENFP": "{name1}（ESTJ）与{name2}（ENFP）是“创意与执行”的磨合：ESTJ关注实际成果，ENFP关注潜在可能。若ESTJ允许ENFP探索，ENFP尊重ESTJ的效率，可实现创新与落地的平衡。",
  "ENFP-ESFJ": "{name1}（ENFP）与{name2}（ESFJ）是“创意与关怀”的结合：ESFJ照顾团队关系，ENFP带来新点子。一个维系稳定，一个推动变革，是乐队持续发展的关键。",
  "ESFJ-ENFP": "{name1}（ESFJ）与{name2}（ENFP）是“创意与关怀”的结合：ESFJ照顾团队关系，ENFP带来新点子。一个维系稳定，一个推动变革，是乐队持续发展的关键。",
  "ENFP-ENFJ": "{name1}（ENFP）与{name2}（ENFJ）是“双ENF”热情组合：都富有同理心与感染力。ENFP更发散创意，ENFJ更聚焦目标。合作时需明确方向，否则容易陷入空想。",
  "ENFJ-ENFP": "{name1}（ENFJ）与{name2}（ENFP）是“双ENF”热情组合：都富有同理心与感染力。ENFP更发散创意，ENFJ更聚焦目标。合作时需明确方向，否则容易陷入空想。",
  "ENFP-ENTJ": "{name1}（ENFP）与{name2}（ENTJ）是“灵感与战略”的互补：ENFP提供创意源泉，ENTJ搭建实现框架。只要ENFP不嫌ENTJ太严苛，ENTJ不嫌ENFP太散漫，便是创新引擎。",
  "ENTJ-ENFP": "{name1}（ENTJ）与{name2}（ENFP）是“灵感与战略”的互补：ENFP提供创意源泉，ENTJ搭建实现框架。只要ENFP不嫌ENTJ太严苛，ENTJ不嫌ENFP太散漫，便是创新引擎。",

  "ENTP-ESTJ": "{name1}（ENTP）与{name2}（ESTJ）是“革新与传统”的拉扯：ENTP总想打破规则，ESTJ希望维持秩序。若ENTP解释变革意义，ESTJ表达担忧原因，可找到中间道路。",
  "ESTJ-ENTP": "{name1}（ESTJ）与{name2}（ENTP）是“革新与传统”的拉扯：ENTP总想打破规则，ESTJ希望维持秩序。若ENTP解释变革意义，ESTJ表达担忧原因，可找到中间道路。",
  "ENTP-ESFJ": "{name1}（ENTP）与{name2}（ESFJ）是“创意与和谐”的挑战：ESFJ重视团队稳定，ENTP喜欢制造变化。若ENTP考虑他人感受，ESFJ开放接受新事物，可激发团队活力。",
  "ESFJ-ENTP": "{name1}（ESFJ）与{name2}（ENTP）是“创意与和谐”的挑战：ESFJ重视团队稳定，ENTP喜欢制造变化。若ENTP考虑他人感受，ESFJ开放接受新事物，可激发团队活力。",
  "ENTP-ENFJ": "{name1}（ENTP）与{name2}（ENFJ）是“可能性与价值”的探索：ENTP提出无数方案，ENFJ筛选符合团队价值观的方向。只要ENTP不戏谑ENFJ的信念，ENFJ不否定ENTP的创意，便是绝佳搭档。",
  "ENFJ-ENTP": "{name1}（ENFJ）与{name2}（ENTP）是“可能性与价值”的探索：ENTP提出无数方案，ENFJ筛选符合团队价值观的方向。只要ENTP不戏谑ENFJ的信念，ENFJ不否定ENTP的创意，便是绝佳搭档。",
  "ENTP-ENTJ": "{name1}（ENTP）与{name2}（ENTJ）是“战术与战略”的协同：ENTP不断测试新方法，ENTJ整合最优路径。在快速变化的音乐市场中，这种组合极具适应力。",
  "ENTJ-ENTP": "{name1}（ENTJ）与{name2}（ENTP）是“战术与战略”的协同：ENTP不断测试新方法，ENTJ整合最优路径。在快速变化的音乐市场中，这种组合极具适应力。",

  "ESTJ-ESFJ": "{name1}（ESTJ）与{name2}（ESFJ）是“双SFJ”责任组合：都重视责任与和谐。ESTJ更果断直接，ESFJ更温和体贴。在乐队管理与对外事务中配合默契。",
  "ESFJ-ESTJ": "{name1}（ESFJ）与{name2}（ESTJ）是“双SFJ”责任组合：都重视责任与和谐。ESTJ更果断直接，ESFJ更温和体贴。在乐队管理与对外事务中配合默契。",
  "ESTJ-ENFJ": "{name1}（ESTJ）与{name2}（ENFJ）是“执行与鼓舞”的结合：ENFJ激励团队士气，ESTJ落实具体行动。只要ENFJ不过度情感化，ESTJ不过度批判，便能协同增效。",
  "ENFJ-ESTJ": "{name1}（ENFJ）与{name2}（ESTJ）是“执行与鼓舞”的结合：ENFJ激励团队士气，ESTJ落实具体行动。只要ENFJ不过度情感化，ESTJ不过度批判，便能协同增效。",
  "ESTJ-ENTJ": "{name1}（ESTJ）与{name2}（ENTJ）是“双ETJ”高效组合：都果断、有条理。ESTJ擅长日常管理，ENTJ擅长长远布局。是乐队商业化的强力推手，但需注意人文关怀。",
  "ENTJ-ESTJ": "{name1}（ENTJ）与{name2}（ESTJ）是“双ETJ”高效组合：都果断、有条理。ESTJ擅长日常管理，ENTJ擅长长远布局。是乐队商业化的强力推手，但需注意人文关怀。",

  "ESFJ-ENFJ": "{name1}（ESFJ）与{name2}（ENFJ）是“双EFJ”关怀组合：都以他人为中心，善于营造温馨氛围。ESFJ关注具体需求，ENFJ关注群体愿景。在粉丝运营与社区建设中极具优势。",
  "ENFJ-ESFJ": "{name1}（ENFJ）与{name2}（ESFJ）是“双EFJ”关怀组合：都以他人为中心，善于营造温馨氛围。ESFJ关注具体需求，ENFJ关注群体愿景。在粉丝运营与社区建设中极具优势。",
  "ESFJ-ENTJ": "{name1}（ESFJ）与{name2}（ENTJ）是“温和与强势”的磨合：ENTJ目标导向，ESFJ人际导向。若ENTJ学会体恤，ESFJ学会直言，可构建既有效率又有人情味的团队。",
  "ENTJ-ESFJ": "{name1}（ENTJ）与{name2}（ESFJ）是“温和与强势”的磨合：ENTJ目标导向，ESFJ人际导向。若ENTJ学会体恤，ESFJ学会直言，可构建既有效率又有人情味的团队。",

  "ENFJ-ENTJ": "{name1}（ENFJ）与{name2}（ENTJ）是“感召与指挥”的结合：ENFJ凝聚人心，ENTJ制定战略。一个赢得人心，一个赢得市场，是乐队扩张的理想核心。",
  "ENTJ-ENFJ": "{name1}（ENTJ）与{name2}（ENFJ）是“感召与指挥”的结合：ENFJ凝聚人心，ENTJ制定战略。一个赢得人心，一个赢得市场，是乐队扩张的理想核心。"
};

function getGenericPairDesc(mbti1, mbti2, name1, name2) {
  const energy1 = mbti1[0]; // E/I
  const energy2 = mbti2[0];
  if (energy1 !== energy2) {
    return `{name1}（{mbti1}）与{name2}（{mbti2}）形成内外互补：一个向外汲取能量，一个向内沉淀思考，合作中需注意沟通节奏。`;
  } else {
    return `{name1}（{mbti1}）与{name2}（{mbti2}）能量同频，容易理解彼此，但也需警惕陷入相同盲区。`;
  }
}

function generateMBTIAnalysis(members) {
  if (members.length === 0) return "未选择成员。";

  let analysis = "<h3>🔹 个体特质</h3><ul>";
  members.forEach(m => {
    const desc = individualDescriptions[m.mbti] || "{name}（{mbti}）的性格特质暂未收录。";
    analysis += `<li>${desc.replace(/\{name\}/g, m.name).replace(/\{mbti\}/g, m.mbti)}</li>`;
  });
  analysis += "</ul>";

  if (members.length >= 2) {
    analysis += "<h3>🔹 两两互动</h3><ul>";
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const m1 = members[i], m2 = members[j];
        const key1 = `${m1.mbti}-${m2.mbti}`;
        const key2 = `${m2.mbti}-${m1.mbti}`;
        let pairDesc = pairDescriptions[key1] || pairDescriptions[key2];
        if (!pairDesc) {
          pairDesc = getGenericPairDesc(m1.mbti, m2.mbti, m1.name, m2.name);
        }
        analysis += `<li>${pairDesc
          .replace(/\{name1\}/g, m1.name)
          .replace(/\{name2\}/g, m2.name)
          .replace(/\{mbti1\}/g, m1.mbti)
          .replace(/\{mbti2\}/g, m2.mbti)
        }</li>`;
      }
    }
    analysis += "</ul>";
  }

  return analysis;
}