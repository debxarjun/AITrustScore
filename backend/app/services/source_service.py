from typing import List, Dict, Any

class SourceService:
    """
    Evaluates source credibility, calculates institutional weighting,
    and deduplicates citations across claims.
    """
    
    def evaluate_sources(self, claims_evaluated: List[Dict[str, Any]]) -> Dict[str, Any]:
        all_sources = []
        seen_urls = set()
        
        supports_count = 0
        contradicts_count = 0
        relevant_count = 0
        credibility_sum = 0.0
        
        for claim in claims_evaluated:
            for em in claim.get("evidence_matches", []):
                url = em.source_url if hasattr(em, "source_url") else em.get("source_url")
                name = em.source_name if hasattr(em, "source_name") else em.get("source_name")
                pub = em.source_publisher if hasattr(em, "source_publisher") else em.get("source_publisher")
                cred = em.source_credibility if hasattr(em, "source_credibility") else em.get("source_credibility", 70.0)
                domain = em.source_domain if hasattr(em, "source_domain") else em.get("source_domain", "")
                rel = em.relationship if hasattr(em, "relationship") else em.get("relationship", "RELEVANT")
                
                if rel == "SUPPORTS":
                    supports_count += 1
                elif rel == "CONTRADICTS":
                    contradicts_count += 1
                else:
                    relevant_count += 1
                    
                credibility_sum += cred
                
                if url not in seen_urls:
                    seen_urls.add(url)
                    all_sources.append({
                        "name": name,
                        "url": url,
                        "publisher": pub,
                        "credibility_score": cred,
                        "domain": domain,
                        "relationship_type": rel,
                        "claim_index": claim.get("claim_index", 1)
                    })
                    
        total_matches = supports_count + contradicts_count + relevant_count
        avg_credibility = (credibility_sum / total_matches) if total_matches > 0 else 30.0
        
        return {
            "sources": all_sources,
            "total_matches": total_matches,
            "supports_count": supports_count,
            "contradicts_count": contradicts_count,
            "relevant_count": relevant_count,
            "average_credibility": avg_credibility
        }
