"""
AI Chat API routes.
Handles general chat interactions with the AI.
"""
import os
import sys
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status

# Add shared components to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from shared.logging import ServiceLogger
from shared.utils import timing_decorator

from core.auth import get_current_user
from schemas import ChatRequest, ChatResponse
from services.ai_service import ai_service
from repositories.user_repository import template_repository

logger = ServiceLogger("ai-chat-api")

router = APIRouter(prefix="/v2/ai", tags=["AI Chat"])


@router.post("/chat", response_model=ChatResponse)
@timing_decorator
async def chat_with_ai(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    """
    Chat with AI.
    
    Args:
        request: Chat request
        current_user: Current authenticated user
    
    Returns:
        Chat response
    """
    try:
        logger.info(f"Processing chat request for user: {current_user.id}")
        
        # Check if AI service is available
        if not ai_service.is_available():
            logger.error("AI service not available")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI services not available - check API key configuration"
            )
        
        # Get template content if template ID provided
        template_content = None
        if request.template_id:
            template = template_repository.get_template_by_id(request.template_id, current_user.id)
            if template:
                template_content = template["template_content"]
        
        # Process chat request
        result = await ai_service.chat(
            message=request.message,
            history=request.history,
            template_content=template_content
        )
        
        if result["success"]:
            logger.success(f"Chat response generated for user {current_user.id}")
            
            return ChatResponse(
                response=result["response"],
                model_used=result.get("model_used", ""),
                processing_time_ms=result.get("processing_time_ms", 0)
            )
        else:
            logger.error(f"Chat request failed: {result.get('error_message', 'Unknown error')}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Chat request failed: {result.get('error_message', 'Unknown error')}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat request failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Chat request failed"
        )
